import os
import sys
import io
import json
import pandas as pd
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add parent directory to path so imports work correctly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from bias_detection.metrics import calculate_fairness_metrics
from bias_detection.ai_explainer import generate_bias_report
from bias_detection.report_engine import generate_pdf_report, generate_ppt_report
from bias_simulator import simulate_biased_dataset, get_csv_download

app = FastAPI(
    title="FairAI Backend", 
    description="Enterprise API for bias detection, fairness simulation and automated audit reporting."
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    metrics: dict
    group_rates: dict
    ai_report: str | None = None

@app.get("/")
def read_root():
    return {
        "status": "operational",
        "engine": "Antigravity Neural Engine",
        "version": "v2.1.0-prod",
        "developer": "Anish | Synapse Squad Hub"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

import polars as pl
from fastapi import BackgroundTasks

TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp_uploads")
os.makedirs(TEMP_DIR, exist_ok=True)

def profile_dataset_task(file_path: str, file_id: str):
    """Heavy background task for full dataset profiling."""
    try:
        # Load with polars for speed
        df = pl.read_csv(file_path)
        
        # Calculate full stats
        stats = {
            "rows": len(df),
            "cols": len(df.columns),
            "missing_values": {col: df[col].null_count() for col in df.columns},
            "types": {col: str(df[col].dtype) for col in df.columns},
            "unique_counts": {col: df[col].n_unique() for col in df.columns[:20]}, # Limit for heavy files
        }
        
        # Save profile to disk
        profile_path = os.path.join(TEMP_DIR, f"{file_id}_profile.json")
        with open(profile_path, 'w') as f:
            json.dump(stats, f)
            
    except Exception as e:
        print(f"Profiling failed for {file_id}: {str(e)}")

@app.get("/get_profile/{file_id}")
async def get_dataset_profile(file_id: str):
    profile_path = os.path.join(TEMP_DIR, f"{file_id}_profile.json")
    if os.path.exists(profile_path):
        with open(profile_path, 'r') as f:
            return json.load(f)
    return {"status": "processing"}

@app.post("/upload_dataset")
async def upload_dataset(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    try:
        # 1. Save file locally first (high performance chunked write)
        file_id = f"ds_{os.urandom(4).hex()}"
        file_path = os.path.join(TEMP_DIR, f"{file_id}.csv")
        
        with open(file_path, "wb") as buffer:
            while chunk := await file.read(1024 * 1024): # 1MB chunks
                buffer.write(chunk)
                
        # 2. Instant Preview (Read only first 100 rows using polars/pandas)
        # Using polars for faster scanning of large files
        df_preview = pl.read_csv(file_path, n_rows=100)
        
        # 3. Auto Detection Logic
        columns = df_preview.columns
        target_aliases = ['loan_approved', 'approved', 'decision', 'outcome', 'label', 'status', 'target', 'hired', 'y', 'accepted', 'selected', 'loan_status']
        sensitive_aliases = ["gender", "age", "race", "ethnicity", "religion", "sex", "nationality", "country"]
        
        detected_target = next((col for col in columns if col.lower() in target_aliases), columns[-1])
        detected_sensitive = [col for col in columns if any(hint in col.lower() for hint in sensitive_aliases)]
        
        # 4. Trigger Background Profiling
        background_tasks.add_task(profile_dataset_task, file_path, file_id)
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "preview": df_preview.to_dicts(),
            "columns": columns,
            "shape": {"rows": "Calculating...", "cols": len(columns)},
            "sensitive_column_hints": detected_sensitive,
            "target_column": detected_target,
            "analysis_ready": True if detected_target != "unknown" and detected_sensitive else False
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"In pill-speed upload failed: {str(e)}")

from bias_detection.shap_explainer import get_shap_explanations

@app.post("/analyze_bias", response_model=AnalysisResponse)
async def analyze_bias_endpoint(
    file_id: str = Form(None),
    file: UploadFile = File(None),
    sensitive_col: str = Form(...),
    target_col: str = Form(...),
    gemini_api_key: str = Form(None)
):
    try:
        df = None
        if file_id:
            file_path = os.path.join(TEMP_DIR, f"{file_id}.csv")
            if os.path.exists(file_path):
                df = pd.read_csv(file_path)
            else:
                 raise HTTPException(status_code=404, detail="Session expired. Please re-upload.")
        elif file:
            contents = await file.read()
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        else:
             raise HTTPException(status_code=400, detail="No dataset provided.")

        # Handle Insights Mode (Step 6)
        if not sensitive_col or sensitive_col == "none" or not target_col or target_col == "none" or sensitive_col not in df.columns or target_col not in df.columns:
            # Dataset Insights Mode
            numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
            stats = {
                "insights_mode": True,
                "correlations": df[numeric_cols].corr().to_dict() if len(numeric_cols) > 1 else {},
                "distributions": {col: df[col].value_counts().head(10).to_dict() for col in df.columns[:10]},
                "summary": df.describe().to_dict()
            }
            return {
                "metrics": stats,
                "group_rates": {},
                "ai_report": "This dataset does not contain a valid decision variable or sensitive attribute for fairness analysis. Switched to General Insights Mode."
            }

        metrics, rates = calculate_fairness_metrics(df, sensitive_col, target_col)
        
        # Add SHAP explanations
        shap_importance = get_shap_explanations(df, target_col)
        metrics['shap_importance'] = shap_importance
        
        ai_report = None
        if gemini_api_key:
            ai_report = generate_bias_report(metrics, rates, sensitive_col, target_col, gemini_api_key)
            
        return {
            "metrics": metrics, 
            "group_rates": rates, 
            "ai_report": ai_report,
            "run_id": f"FA-{os.urandom(3).hex().upper()}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_dataset_generic(
    file: UploadFile = File(...),
    sensitive_feature: str = Form(...),
    target_variable: str = Form(...),
    prediction_variable: str = Form(None),
    gemini_api_key: str = Form(None)
):
    # This is an alias for analyze_bias_endpoint to maintain backward compatibility
    return await analyze_bias_endpoint(file, sensitive_feature, target_variable, gemini_api_key)

@app.post("/simulate")
async def simulate_bias(
    gender_bias: float = Form(0.2),
    income_bias: float = Form(0.1),
    age_bias: float = Form(0.05),
    size: int = Form(1000)
):
    try:
        df = simulate_biased_dataset(gender_bias, income_bias, age_bias, size)
        csv_data = get_csv_download(df)
        
        # Also run analysis on the simulated data
        metrics, rates = calculate_fairness_metrics(df, "gender", "loan_approved")
        
        return {
            "csv": csv_data,
            "metrics": metrics,
            "rates": rates,
            "sample": df.head(10).to_dict(orient='records')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

@app.post("/export/pdf")
async def export_pdf(data: str = Form(...)):
    try:
        report_data = json.loads(data)
        pdf_buffer = generate_pdf_report(report_data)
        return Response(
            content=pdf_buffer.getvalue(),
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=FairAI_Audit_Report.pdf",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/export/ppt")
async def export_ppt(data: str = Form(...)):
    try:
        report_data = json.loads(data)
        ppt_buffer = generate_ppt_report(report_data)
        return Response(
            content=ppt_buffer.getvalue(),
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={
                "Content-Disposition": "attachment; filename=FairAI_Audit_Presentation.pptx",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
