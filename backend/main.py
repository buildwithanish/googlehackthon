"""
backend/main.py
FairAI – Enhanced FastAPI backend
Endpoints: upload_dataset, analyze_bias, fairness_metrics, bias_report, generate_ai_explanation
Run: uvicorn backend.main:app --reload --port 8000
"""

import io
import json
import os
import sys

import pandas as pd
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse, Response

# Make parent importable when running from repo root
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from bias_detection.metrics import compute_fairness_metrics, get_bias_summary
from bias_detection.ai_explainer import generate_explanation

# ── App Setup ─────────────────────────────────────────────────────────────────

app = FastAPI(
    title="FairAI – Bias Detection API",
    description=(
        "Full REST API for detecting and explaining bias in ML datasets. "
        "Supports Demographic Parity, Equal Opportunity, Disparate Impact. "
        "Powered by Fairlearn + Google Gemini."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory session (stateless per request, but cached for demo) ─────────────
_analysis_cache: dict = {}


# ═══════════════════════════════════════════════════════════════════════════════
# STATUS ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/", response_class=HTMLResponse, tags=["Status"])
def root():
    return """
    <html><head><title>FairAI API</title></head>
    <body style="font-family:Inter,sans-serif;padding:2rem;background:#0E1117;color:#eee;max-width:600px;margin:auto">
    <h1 style="color:#6C63FF">⚖️ FairAI Bias Detection API</h1>
    <p>Status: <strong style="color:#2ECC71">Running ✅</strong></p>
    <p>Version: <strong>2.0.0</strong></p>
    <ul>
      <li><a href="/docs" style="color:#43CBFF">Interactive API Docs (Swagger) →</a></li>
      <li><a href="/redoc" style="color:#43CBFF">ReDoc Documentation →</a></li>
      <li><a href="/health" style="color:#43CBFF">Health Check →</a></li>
    </ul>
    <hr style="border-color:#333">
    <p style="color:#666;font-size:.85rem">FairAI · Build with AI – Solution Challenge 2026</p>
    </body></html>
    """


@app.get("/health", tags=["Status"])
def health():
    """JSON health check."""
    return {
        "status": "ok",
        "service": "FairAI Bias Detection API",
        "version": "2.0.0",
        "gemini_key_configured": bool(os.environ.get("GEMINI_API_KEY")),
    }


# ═══════════════════════════════════════════════════════════════════════════════
# DATASET ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/upload_dataset", tags=["Dataset"])
async def upload_dataset(file: UploadFile = File(..., description="CSV dataset file")):
    """
    Upload a CSV dataset and get a preview + column metadata.
    Returns column names, dtypes, shape, and a preview of first 20 rows.
    """
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse CSV: {e}")

    # Detect potential sensitive columns
    sensitive_hints = []
    lower_cols = [c.lower() for c in df.columns]
    for keyword in ["gender", "sex", "race", "ethnicity", "age", "income",
                    "education", "location", "zip", "nationality"]:
        matches = [df.columns[i] for i, c in enumerate(lower_cols) if keyword in c]
        sensitive_hints.extend(matches)

    return {
        "filename": file.filename,
        "shape": {"rows": len(df), "cols": len(df.columns)},
        "columns": list(df.columns),
        "dtypes": {col: str(df[col].dtype) for col in df.columns},
        "missing_values": {col: int(df[col].isnull().sum()) for col in df.columns},
        "unique_counts": {col: int(df[col].nunique()) for col in df.columns},
        "preview": df.head(20).to_dict(orient="records"),
        "statistics": json.loads(df.describe(include="all").fillna("").to_json()),
        "sensitive_column_hints": list(set(sensitive_hints)),
    }


@app.post("/columns", tags=["Dataset"])
async def get_columns(file: UploadFile = File(...)):
    """Return column names and types from a CSV."""
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        return {
            "columns": list(df.columns),
            "dtypes": {col: str(df[col].dtype) for col in df.columns},
            "shape": {"rows": len(df), "cols": len(df.columns)},
        }
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse CSV: {e}")


# ═══════════════════════════════════════════════════════════════════════════════
# BIAS ANALYSIS ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/analyze_bias", tags=["Bias Detection"])
async def analyze_bias(
    file: UploadFile = File(..., description="CSV dataset file"),
    target_col: str = Form(..., description="Target / label column name"),
    sensitive_col: str = Form(..., description="Protected attribute column name"),
):
    """
    Analyze a CSV dataset for algorithmic bias.

    Computes:
    - Demographic Parity Difference
    - Equalized Odds Difference
    - Disparate Impact Ratio
    - Overall Fairness Score (0-100)
    - Per-group positive rates
    - Bias alert flag
    """
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse CSV: {e}")

    for col, label in [(target_col, "target_col"), (sensitive_col, "sensitive_col")]:
        if col not in df.columns:
            raise HTTPException(
                status_code=422,
                detail=f"Column '{col}' not found. Available columns: {list(df.columns)}",
            )

    try:
        metrics = compute_fairness_metrics(df, target_col, sensitive_col)
        summary = get_bias_summary(metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Metrics computation failed: {e}")

    # Build group details for frontend charts
    group_rates = metrics.get("group_positive_rates", {})
    rates_list = list(group_rates.values())
    max_rate = max(rates_list) if rates_list else 1

    group_details = []
    for group, rate in group_rates.items():
        di_vs_best = round(rate / max_rate, 4) if max_rate > 0 else 1.0
        group_details.append({
            "group": group,
            "positive_rate": rate,
            "di_vs_best": di_vs_best,
            "passes_80_rule": di_vs_best >= 0.8,
        })

    return {
        "metrics": metrics,
        "summary": summary,
        "group_details": group_details,
        "dataset_info": {
            "rows": len(df),
            "columns": list(df.columns),
            "filename": file.filename,
            "target_col": target_col,
            "sensitive_col": sensitive_col,
        },
    }


@app.get("/fairness_metrics", tags=["Bias Detection"])
def get_fairness_metrics_info():
    """
    Returns descriptions and thresholds for all supported fairness metrics.
    Useful for frontend to display metric explanations.
    """
    return {
        "metrics": [
            {
                "id": "demographic_parity_difference",
                "name": "Demographic Parity Difference",
                "ideal_value": 0.0,
                "threshold": 0.1,
                "direction": "lower_is_better",
                "description": (
                    "Measures the difference in positive prediction rates between the "
                    "best and worst performing demographic groups. Ideal value is 0."
                ),
                "interpretation": {
                    "0.0": "Perfectly fair — equal positive rates across all groups",
                    "0.0–0.1": "Acceptable — minor variation within tolerable range",
                    "0.1–0.2": "Concerning — noticeable disparity requiring attention",
                    ">0.2": "Critical — significant bias detected",
                },
            },
            {
                "id": "equalized_odds_difference",
                "name": "Equalized Odds Difference",
                "ideal_value": 0.0,
                "threshold": 0.1,
                "direction": "lower_is_better",
                "description": (
                    "Measures the maximum difference in true positive and false positive "
                    "rates across groups. Ideal value is 0."
                ),
                "interpretation": {
                    "0.0": "Perfectly fair error rates across all groups",
                    "0.0–0.1": "Acceptable",
                    ">0.1": "Model errors are unevenly distributed across groups",
                },
            },
            {
                "id": "disparate_impact",
                "name": "Disparate Impact Ratio",
                "ideal_value": 1.0,
                "threshold": 0.8,
                "direction": "higher_is_better",
                "description": (
                    "Ratio of positive prediction rates between least and most "
                    "favored groups. Values below 0.8 violate the '80% Rule'."
                ),
                "interpretation": {
                    "1.0": "Perfectly fair",
                    "0.8–1.0": "Acceptable range (passes 80% rule)",
                    "<0.8": "Violates 80% rule — legally actionable bias",
                },
            },
            {
                "id": "fairness_score",
                "name": "Overall Fairness Score",
                "ideal_value": 100,
                "threshold": 80,
                "direction": "higher_is_better",
                "description": (
                    "Composite 0–100 score aggregating all three metrics. "
                    "80+ is acceptable, 60–80 is concerning, below 60 is critical."
                ),
                "interpretation": {
                    "80–100": "Low bias — system is broadly fair",
                    "60–79": "Moderate bias — review and mitigate",
                    "<60": "High bias — immediate action required",
                },
            },
        ]
    }


# ═══════════════════════════════════════════════════════════════════════════════
# AI EXPLANATION ENDPOINT
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/generate_ai_explanation", tags=["AI Insights"])
async def generate_ai_explanation(
    file: UploadFile = File(..., description="CSV dataset file"),
    target_col: str = Form(..., description="Target column name"),
    sensitive_col: str = Form(..., description="Protected attribute column"),
    gemini_api_key: str = Form(default="", description="Google Gemini API key"),
):
    """
    Analyze a dataset for bias AND generate AI-powered explanation using Google Gemini.

    Returns:
    - Full fairness metrics
    - AI-generated bias explanation (plain language)
    - Mitigation recommendations (5 specific techniques)
    - Executive summary for compliance teams
    """
    api_key = gemini_api_key or os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="Gemini API key required. Pass gemini_api_key in form or set GEMINI_API_KEY env var.",
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse CSV: {e}")

    for col in [target_col, sensitive_col]:
        if col not in df.columns:
            raise HTTPException(
                status_code=422,
                detail=f"Column '{col}' not found. Available: {list(df.columns)}",
            )

    try:
        metrics = compute_fairness_metrics(df, target_col, sensitive_col)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Metrics computation failed: {e}")

    ai_results = generate_explanation(
        metrics=metrics,
        target_col=target_col,
        sensitive_col=sensitive_col,
        dataset_info={"n_samples": len(df)},
        api_key=api_key,
    )

    if ai_results.get("error"):
        raise HTTPException(status_code=502, detail=f"Gemini API error: {ai_results['error']}")

    return {
        "metrics": metrics,
        "ai_explanation": ai_results.get("explanation", ""),
        "ai_recommendations": ai_results.get("recommendations", ""),
        "ai_report_summary": ai_results.get("report_summary", ""),
        "dataset_info": {
            "rows": len(df),
            "filename": file.filename,
            "target_col": target_col,
            "sensitive_col": sensitive_col,
        },
    }


# ═══════════════════════════════════════════════════════════════════════════════
# REPORT ENDPOINT
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/bias_report", tags=["Reports"])
async def bias_report(
    file: UploadFile = File(...),
    target_col: str = Form(...),
    sensitive_col: str = Form(...),
    format: str = Form(default="json", description="Report format: json | markdown"),
):
    """
    Generate a bias audit report in JSON or Markdown format.
    """
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse CSV: {e}")

    for col in [target_col, sensitive_col]:
        if col not in df.columns:
            raise HTTPException(status_code=422, detail=f"Column '{col}' not found.")

    metrics = compute_fairness_metrics(df, target_col, sensitive_col)
    summary = get_bias_summary(metrics)

    if format.lower() == "markdown":
        from dashboard.reporting import generate_markdown_report
        md = generate_markdown_report(metrics, {}, target_col, sensitive_col, file.filename)
        return Response(content=md, media_type="text/markdown",
                        headers={"Content-Disposition": "attachment; filename=fairai_report.md"})

    return {
        "report": {
            "filename": file.filename,
            "target_col": target_col,
            "sensitive_col": sensitive_col,
            "n_samples": len(df),
            "metrics": metrics,
            "summary": summary,
            "bias_level": (
                "HIGH" if metrics["fairness_score"] < 60
                else "MODERATE" if metrics["fairness_score"] < 80
                else "LOW"
            ),
        }
    }
