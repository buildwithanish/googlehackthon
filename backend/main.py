import os
import io
import json
import pandas as pd
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import sys

# Ensure custom modules are discoverable
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from bias_simulator import simulate_biased_dataset, get_csv_download
from bias_detection.metrics import calculate_fairness_metrics
from bias_detection.ai_explainer import generate_bias_report
from bias_detection.shap_explainer import get_shap_explanations
from bias_detection.report_engine import generate_pdf_report, generate_ppt_report

app = FastAPI(title="FairAI Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp_datasets"
os.makedirs(TEMP_DIR, exist_ok=True)

class AnalysisResponse(BaseModel):
    success: bool
    metrics: Optional[Dict[str, Any]] = None
    preview: Optional[List[Dict[str, Any]]] = None
    group_rates: Optional[Dict[str, float]] = None
    ai_report: Optional[str] = None
    error: Optional[str] = None
    message: Optional[str] = None
    run_id: Optional[str] = None

def parse_nlq(query: str, columns: List[str]) -> Dict[str, str]:
    query = query.lower()
    mapping = {"target": "", "sensitive": ""}
    for col in columns:
        c_low = col.lower()
        if c_low in query:
            if any(t in query for t in ['target', 'outcome', 'predict', 'result']):
                mapping["target"] = col
            if any(s in query for s in ['sensitive', 'bias', 'gender', 'race', 'age', 'protected']):
                mapping["sensitive"] = col
    return mapping

def guess_dataset_domain(columns: List[str], df: pd.DataFrame) -> str:
    cols_str = " ".join(columns).lower()
    if any(k in cols_str for k in ['loan', 'credit', 'interest', 'debt']): return "Financial Services / Credit Risk"
    if any(k in cols_str for k in ['patient', 'diagnosis', 'health', 'treatment']): return "Healthcare Diagnostics"
    if any(k in cols_str for k in ['recruit', 'hiring', 'resume', 'candidate']): return "Human Resources / Recruiting"
    if any(k in cols_str for k in ['crime', 'bail', 'sentence', 'arrest']): return "Criminal Justice / Risk Assessment"
    return "Universal Business Intelligence"

async def profile_dataset_task(file_path: str, file_id: str):
    # Background profiling logic placeholder
    pass

@app.get("/health")
async def health_check():
    return {"status": "Quantum Core Active", "backend": "Ready"}

@app.post("/upload_dataset")
async def upload_dataset(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    try:
        if not file.filename.endswith('.csv'):
            return {"success": False, "error": "Invalid format", "message": "Only CSV files are supported currently."}
            
        file_id = f"ds_{os.urandom(4).hex()}"
        file_path = os.path.join(TEMP_DIR, f"{file_id}.csv")
        
        contents = await file.read()
        with open(file_path, "wb") as buffer:
            buffer.write(contents)
            
        df_full = pd.read_csv(io.BytesIO(contents), on_bad_lines='skip', low_memory=False)
        df_full.columns = [str(c).strip() if str(c).strip() else f"column_{i}" for i, c in enumerate(df_full.columns)]
        
        columns = df_full.columns.tolist()
        domain = guess_dataset_domain(columns, df_full)
        
        target_aliases = ['loan_approved', 'approved', 'decision', 'outcome', 'label', 'status', 'target', 'hired', 'y', 'accepted']
        sensitive_aliases = ["gender", "age", "race", "ethnicity", "religion", "sex", "nationality"]
        
        detected_target = next((col for col in columns if col.lower() in target_aliases), columns[-1] if columns else "none")
        detected_sensitive = [col for col in columns if any(hint in col.lower() for hint in sensitive_aliases)]
        
        background_tasks.add_task(profile_dataset_task, file_path, file_id)
        
        return {
            "success": True,
            "file_id": file_id,
            "filename": file.filename,
            "domain": domain,
            "preview": df_full.head(50).fillna("").to_dict(orient='records'),
            "columns": columns,
            "stats": {
                "rows": len(df_full),
                "cols": len(columns),
                "missing_total": int(df_full.isnull().sum().sum())
            },
            "sensitive_column_hints": detected_sensitive,
            "target_column": detected_target,
            "analysis_ready": True if detected_target != "none" and detected_sensitive else False
        }
    except Exception as e:
        return {"success": False, "error": "Parsing Failed", "message": str(e)}

@app.post("/analyze_bias", response_model=AnalysisResponse)
async def analyze_bias_endpoint(
    file_id: str = Form(None),
    file: UploadFile = File(None),
    target_col: str = Form(None),
    sensitive_col: str = Form(None),
    gemini_api_key: str = Form(None),
    nlq_query: str = Form(None)
):
    try:
        df = None
        if file:
            contents = await file.read()
            df = pd.read_csv(io.BytesIO(contents), on_bad_lines='skip')
        elif file_id:
            file_path = os.path.join(TEMP_DIR, f"{file_id}.csv")
            if os.path.exists(file_path):
                df = pd.read_csv(file_path, low_memory=False)
        
        if df is None:
            return {"success": False, "error": "No Data", "message": "Dataset not found."}

        df.columns = [str(c).strip() for c in df.columns]
        cols = df.columns.tolist()

        if nlq_query:
            mapping = parse_nlq(nlq_query, cols)
            if mapping.get("target"): target_col = mapping["target"]
            if mapping.get("sensitive"): sensitive_col = mapping["sensitive"]

        if not target_col or target_col == "none" or target_col not in cols:
            target_aliases = ['target', 'label', 'approved', 'decision', 'outcome', 'loan_status', 'hired']
            target_col = next((c for c in cols if any(a in c.lower() for a in target_aliases)), cols[-1])
            
        if not sensitive_col or sensitive_col == "none" or sensitive_col not in cols:
            sensitive_aliases = ['gender', 'race', 'age', 'sex', 'ethnicity']
            sensitive_col = next((c for c in cols if any(a in c.lower() for a in sensitive_aliases)), cols[0])

        # Multi-mode switcher
        is_explorer = False
        if df[target_col].nunique() > 10 and not pd.api.types.is_numeric_dtype(df[target_col]):
             is_explorer = True
        
        if is_explorer:
            stats = {
                "insights_mode": True,
                "explorer_mode": True,
                "domain": guess_dataset_domain(cols, df),
                "quality_score": round(100 - (df.isnull().mean().mean() * 100), 1),
                "distributions": {c: df[c].value_counts().head(5).to_dict() for c in cols[:6]}
            }
            return {
                "success": True,
                "metrics": stats, 
                "preview": df.head(50).fillna("").to_dict(orient='records'),
                "ai_report": f"Universal Audit: Successfully processed this {stats['domain']}."
            }

        metrics, rates = calculate_fairness_metrics(df, sensitive_col, target_col)
        shap_importance = get_shap_explanations(df, target_col)
        metrics['shap_importance'] = shap_importance
        metrics['domain'] = guess_dataset_domain(cols, df)
        
        ai_report = None
        if gemini_api_key:
            ai_report = generate_bias_report(metrics, rates, sensitive_col, target_col, gemini_api_key)
            
        return {
            "success": True,
            "metrics": metrics, 
            "preview": df.head(50).fillna("").to_dict(orient='records'),
            "group_rates": rates, 
            "ai_report": ai_report,
            "run_id": f"UA-{os.urandom(3).hex().upper()}"
        }
    except Exception as e:
        return {"success": False, "error": "Analysis Failed", "message": str(e)}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_legacy(file: UploadFile = File(...), sensitive_feature: str = Form(...), target_variable: str = Form(...), gemini_api_key: str = Form(None)):
    return await analyze_bias_endpoint(file=file, target_col=target_variable, sensitive_col=sensitive_feature, gemini_api_key=gemini_api_key)

@app.post("/simulate")
async def simulate_bias(gender_bias: float = Form(0.2), income_bias: float = Form(0.1), size: int = Form(1000)):
    df = simulate_biased_dataset(gender_bias, income_bias, 0.05, size)
    metrics, rates = calculate_fairness_metrics(df, "gender", "loan_approved")
    return {"csv": get_csv_download(df), "metrics": metrics, "rates": rates, "sample": df.head(10).to_dict(orient='records')}

@app.post("/export/pdf")
async def export_pdf(data: str = Form(...)):
    pdf = generate_pdf_report(json.loads(data))
    return Response(content=pdf.getvalue(), media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=FairAI_Audit.pdf"})

@app.post("/export/ppt")
async def export_ppt(data: str = Form(...)):
    ppt = generate_ppt_report(json.loads(data))
    return Response(content=ppt.getvalue(), media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation", headers={"Content-Disposition": "attachment; filename=FairAI_Presentation.pptx"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
