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

TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp_uploads")
os.makedirs(TEMP_DIR, exist_ok=True)

@app.post("/upload_dataset")
async def upload_dataset(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8', errors='ignore')))
        
        # Step 5: Data Cleaning Engine
        # Remove completely empty rows
        df.dropna(how='all', inplace=True)
        # Remove duplicate rows
        df.drop_duplicates(inplace=True)
        
        # Handle missing values & adapt categorical
        for col in df.columns:
            if df[col].dtype == object:
                # fill missing categoricals
                df[col] = df[col].fillna("Unknown").astype(str)
            else:
                # fill numeric with median
                if not df[col].isnull().all():
                    df[col] = df[col].fillna(df[col].median())
                else:
                    df[col] = df[col].fillna(0)
                    
        # Step 11: Auto Target Detection
        target_aliases = ['loan_approved', 'approved', 'decision', 'outcome', 'label', 'status', 'target', 'hired', 'y']
        detected_target = df.columns[-1] if len(df.columns) > 0 else "unknown"
        for col in df.columns:
            if col.lower() in target_aliases:
                detected_target = col
                break

        # Step 2: Auto column mapping (fuzzy detection for sensitive/features happens below dynamically)
        
        # Save file for later analysis
        file_id = f"ds_{os.urandom(4).hex()}"
        file_path = os.path.join(TEMP_DIR, f"{file_id}.csv")
        df.to_csv(file_path, index=False)

        # Data Preview & Stats (Step 6/10)
        # Step 6: first 100 rows
        preview = df.head(100).fillna("").to_dict(orient='records')
        stats = {
            "rows": len(df),
            "cols": len(df.columns),
            "column_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
            "missing_values": df.isnull().sum().to_dict(),
            "unique_values": {col: df[col].nunique() for col in df.columns[:15]},
            "target_detected": detected_target
        }
        
        sensitive_hints = [col for col in df.columns if any(hint in col.lower() for hint in ["gender", "age", "race", "ethnicity", "religion", "sex", "nationality"])]
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "preview": preview,
            "columns": list(df.columns),
            "shape": {"rows": len(df), "cols": len(df.columns)},
            "stats": stats,
            "sensitive_column_hints": sensitive_hints,
            "target_column": detected_target
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload processing failed: {str(e)}")

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

        metrics, rates = calculate_fairness_metrics(df, sensitive_col, target_col)
        
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
