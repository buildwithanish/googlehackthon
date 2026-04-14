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

def guess_dataset_domain(columns: list, df: pd.DataFrame):
    cols_set = {str(c).lower() for c in columns}
    
    if any(c in cols_set for c in ['loan', 'credit', 'amount', 'mortgage', 'default']):
        return "Financial/Loan Dataset"
    if any(c in cols_set for c in ['sale', 'revenue', 'price', 'product', 'customer_id', 'order']):
        return "Sales/E-commerce Dataset"
    if any(c in cols_set for c in ['hired', 'resume', 'candidate', 'applicant', 'job', 'interview']):
        return "HR/Recruitment Dataset"
    if any(c in cols_set for c in ['patient', 'diagnosis', 'treatment', 'medical', 'blood', 'heart']):
        return "Healthcare/Medical Dataset"
    if any(c in cols_set for c in ['survey', 'rating', 'feedback', 'satisfaction', 'score']):
        return "Survey/User Feedback Dataset"
    if any(c in cols_set for c in ['student', 'grade', 'exam', 'course', 'university']):
        return "Education/Student Dataset"
    
    return "General Data Intelligence"

@app.post("/upload_dataset")
async def upload_dataset(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    try:
        if not file.filename.endswith('.csv'):
            return {"success": False, "error": "Invalid format", "message": "Only CSV files are supported currently."}
            
        file_id = f"ds_{os.urandom(4).hex()}"
        file_path = os.path.join(TEMP_DIR, f"{file_id}.csv")
        
        # Save chunked
        filesize = 0
        with open(file_path, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                buffer.write(chunk)
                filesize += len(chunk)
        
        # Step 2: Robust CSV Parsing (sep=None to auto-detect delimiter)
        # We use pandas here because polars might be stricter on formatting for initial scan
        df_full = pd.read_csv(file_path, sep=None, engine='python', on_bad_lines='skip')
        df_full.columns = [str(c).strip() for c in df_full.columns]
        
        # Step 3: Preview Generation (Always head 50)
        df_preview = df_full.head(50)
        
        # Step 6: Column Auto Detection
        columns = df_full.columns.tolist()
        numeric_cols = df_full.select_dtypes(include=['number']).columns.tolist()
        categorical_cols = df_full.select_dtypes(include=['object', 'category']).columns.tolist()
        
        domain = guess_dataset_domain(columns, df_full)
        
        # Auto-detection for Bias analysis
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
            "preview": df_preview.to_dict(orient='records'),
            "columns": columns,
            "stats": {
                "rows": len(df_full),
                "cols": len(columns),
                "numeric_count": len(numeric_cols),
                "categorical_count": len(categorical_cols),
                "missing_total": int(df_full.isnull().sum().sum())
            },
            "sensitive_column_hints": detected_sensitive,
            "target_column": detected_target,
            "analysis_ready": True if detected_target != "none" and detected_sensitive else False
        }
    except Exception as e:
        print(f"UPLOAD ERROR: {str(e)}")
        return {"success": False, "error": "Parsing Failed", "message": f"Could not process CSV: {str(e)}"}

@app.post("/analyze_bias")
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
                # Robust reading for analysis too
                df = pd.read_csv(file_path, sep=None, engine='python')
                df.columns = [str(c).strip() for c in df.columns]
            else:
                 return {"success": False, "error": "Session Lost", "message": "File not found on server."}
        elif file:
            contents = await file.read()
            df = pd.read_csv(io.StringIO(contents.decode('utf-8', errors='ignore')), sep=None, engine='python')
            df.columns = [str(c).strip() for c in df.columns]
        else:
             return {"success": False, "error": "No Data", "message": "Missing dataset."}

        # Step 1: Remove strict row limit
        if len(df) == 0:
            return {"success": False, "error": "Empty Dataset", "message": "CSV contains no rows."}

        # Step 4: Universal Data Mode (Data Explorer)
        # If no bias parameters, or only 1 row (too few for metrics), switch to Explorer
        is_explorer = False
        if len(df) < 5 or not sensitive_col or sensitive_col == "none" or sensitive_col not in df.columns or target_col not in df.columns:
            is_explorer = True

        if is_explorer:
            numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
            cat_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
            
            # Smart Analysis: Auto-identify important distributions
            distributions = {}
            for col in (cat_cols + numeric_cols)[:12]: # Limit to 12 columns
                if col in cat_cols:
                    distributions[col] = df[col].value_counts().head(5).to_dict()
                else:
                    # For numeric, show a simple histogram binning
                    try:
                        distributions[col] = df[col].value_counts(bins=5).to_dict()
                        # Clean bin names for JSON
                        distributions[col] = {str(k): v for k, v in distributions[col].items()}
                    except:
                        distributions[col] = df[col].head(5).to_dict()

            stats = {
                "insights_mode": True,
                "explorer_mode": True,
                "domain": guess_dataset_domain(df.columns.tolist(), df),
                "correlations": df[numeric_cols].corr().to_dict() if len(numeric_cols) > 1 else {},
                "distributions": distributions,
                "summary": df.describe().to_dict(),
                "column_types": {col: str(df[col].dtype) for col in df.columns}
            }
            return {
                "success": True,
                "metrics": stats,
                "group_rates": {},
                "ai_report": f"Universal Analysis: Successfully parsed this {stats['domain']}. Displaying general data distribution and profile intelligence."
            }

        # Original Bias Metrics logic
        metrics, rates = calculate_fairness_metrics(df, sensitive_col, target_col)
        shap_importance = get_shap_explanations(df, target_col)
        metrics['shap_importance'] = shap_importance
        metrics['domain'] = guess_dataset_domain(df.columns.tolist(), df)
        
        ai_report = None
        if gemini_api_key:
            ai_report = generate_bias_report(metrics, rates, sensitive_col, target_col, gemini_api_key)
            
        return {
            "success": True,
            "metrics": metrics, 
            "group_rates": rates, 
            "ai_report": ai_report,
            "run_id": f"UA-{os.urandom(3).hex().upper()}"
        }
    except Exception as e:
        print(f"ANALYSIS CRASH: {str(e)}")
        return {
            "success": False, 
            "error": "Dataset Loaded successfully. Limited insights available.", 
            "message": f"Parsing Error: {str(e)}"
        }

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
