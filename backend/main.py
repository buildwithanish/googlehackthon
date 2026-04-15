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

from fastapi import BackgroundTasks
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp_uploads")
os.makedirs(TEMP_DIR, exist_ok=True)

def get_shap_explanations(df: pd.DataFrame, target_col: str):
    """Calculate feature importance as a proxy for SHAP for real-time responsiveness."""
    try:
        if target_col not in df.columns:
            return {}
        
        # Prepare data
        X = df.drop(columns=[target_col]).select_dtypes(include=['number']).fillna(0)
        y = df[target_col]
        
        if X.empty or len(X) < 5:
            return {}

        # Simple RF Importance
        model = RandomForestClassifier(n_estimators=50, max_depth=5)
        model.fit(X, y)
        
        importances = dict(zip(X.columns, model.feature_importances_.tolist()))
        # Sort and return top 10
        return dict(sorted(importances.items(), key=lambda x: x[1], reverse=True)[:10])
    except:
        return {}

def profile_dataset_task(file_path: str, file_id: str):
    """Heavy background task for full dataset profiling."""
    try:
        # Load with pandas
        df = pd.read_csv(file_path, sep=None, engine='python')
        
        # Calculate full stats
        stats = {
            "rows": len(df),
            "cols": len(df.columns),
            "missing_values": df.isnull().sum().to_dict(),
            "column_types": {str(k): str(v) for k, v in df.dtypes.items()},
            "unique_counts": {col: int(df[col].nunique()) for col in df.columns[:20]}, # Limit for heavy files
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
    
    if any(c in cols_set for c in ['loan', 'credit', 'amount', 'mortgage', 'default', 'interest']):
        return "Financial/Banking Analysis"
    if any(c in cols_set for c in ['sale', 'revenue', 'price', 'product', 'customer_id', 'order', 'sku']):
        return "Sales & E-commerce Portfolio"
    if any(c in cols_set for c in ['hired', 'resume', 'candidate', 'applicant', 'job', 'interview', 'salary']):
        return "HR/Recruitment Analytics"
    if any(c in cols_set for c in ['patient', 'diagnosis', 'treatment', 'medical', 'blood', 'heart', 'glucose']):
        return "Healthcare/Medical Monitoring"
    if any(c in cols_set for c in ['churn', 'customer', 'loyalty', 'satisfaction', 'nps', 'user_id', 'retention']):
        return "Customer/CRM Relationship Data"
    if any(c in cols_set for c in ['traffic', 'clicks', 'campaign', 'ad', 'marketing', 'conversion', 'leads']):
        return "Digital Marketing Performance"
    if any(c in cols_set for c in ['student', 'grade', 'exam', 'course', 'university', 'gpa', 'education']):
        return "Education/Student Performance"
    if any(c in cols_set for c in ['log', 'timestamp', 'cpu', 'memory', 'status_code', 'error', 'request']):
        return "System Logs/Infrastructure Audit"
    
    return "Universal Intelligence Layer"

def parse_nlq(query: str, columns: list):
    """Basic Natural Language Query mapper for interactive dashboarding."""
    q = query.lower()
    mapping = {"target": None, "sensitive": None}
    
    # Try to find columns mentioned in the query
    found_cols = [col for col in columns if col.lower() in q]
    
    if "bias" in q or "fairness" in q:
        # User wants bias analysis
        mapping["sensitive"] = found_cols[0] if found_cols else None
        mapping["target"] = found_cols[1] if len(found_cols) > 1 else None
    
    if "distribution" in q or "show" in q or "chart" in q:
        # User wants a specific distribution
        mapping["target"] = found_cols[0] if found_cols else None
        
    return mapping
    
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
        
        # Step 1: Universal CSV Parser with Encoding Fallbacks
        encodings = ['utf-8', 'latin1', 'iso-8859-1', 'utf-8-sig', 'cp1252', 'mac_roman']
        delimiters = [',', ';', '\t', '|']
        df_full = None
        error_msg = ""
        
        for enc in encodings:
            if df_full is not None: break
            for sep in delimiters:
                try:
                    # Try reading with specific encoding and separator
                    df_full = pd.read_csv(file_path, sep=sep, encoding=enc, on_bad_lines='skip', low_memory=False)
                    # Basic check if it actually parsed columns correctly
                    if len(df_full.columns) > 1 or (len(df_full.columns) == 1 and len(df_full) > 1):
                        df_full.dropna(how="all", inplace=True)
                        if not df_full.empty:
                            print(f"[FairAI] Successfully parsed: Enc={enc}, Sep={sep}")
                            break
                    df_full = None # Reset if it looks like a single-column failure
                except Exception as e:
                    error_msg = str(e)
                    continue
        
        # FINAL FALLBACK: Let pandas auto-detect if everything else failed
        if df_full is None:
            try:
                df_full = pd.read_csv(file_path, sep=None, engine='python', on_bad_lines='skip')
                print("[FairAI] Fallback to Auto-detect success")
            except Exception as e:
                error_msg = str(e)

        if df_full is None or df_full.empty:
             return {"success": False, "error": "Parser Error", "message": f"Incompatible CSV format. Humne kai techniques try ki par aapka file readable nahi hai. Please ensure it's a valid CSV. Error: {error_msg}"}

        # Step 4: Safe Header Detection
        df_full.columns = [str(c).strip() if str(c).strip() else f"column_{i}" for i, c in enumerate(df_full.columns)]
        
        # Step 3: Preview Generation
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
    target_col: str = Form(None), 
    sensitive_col: str = Form(None),
    gemini_api_key: str = Form(None),
    nlq_query: str = Form(None)
):
    try:
        if not file and not file_id:
             return {"success": False, "error": "No Data", "message": "Missing dataset."}
        
        # Load data
        df = None
        if file_id:
            file_path = os.path.join(TEMP_DIR, f"{file_id}.csv")
            if os.path.exists(file_path):
                df = pd.read_csv(file_path, sep=None, engine='python')
                df.columns = [str(c).strip() for c in df.columns]
            else:
                 return {"success": False, "error": "Session Lost", "message": "File not found on server."}
        elif file:
            df = pd.read_csv(io.BytesIO(await file.read()), sep=None, engine='python')
            df.columns = [str(c).strip() for c in df.columns]

        if df is None or len(df) == 0:
             return {"success": False, "error": "No Data", "message": "Dataset is empty or could not be read."}

        # Step 1: NLQ Mapping Override
        if nlq_query:
            mapping = parse_nlq(nlq_query, df.columns.tolist())
            if mapping["target"]: target_col = mapping["target"]
            if mapping["sensitive"]: sensitive_col = mapping["sensitive"]

        # Step 4: Universal Data Mode (Data Explorer)
        is_explorer = False
        if len(df) < 5 or not sensitive_col or sensitive_col == "none" or sensitive_col not in df.columns or (target_col and target_col not in df.columns):
            is_explorer = True

        if is_explorer:
            numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
            cat_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
            date_cols = [col for col in df.columns if 'date' in col.lower() or 'time' in col.lower()]
            
            # Step 2: Quality Score & Outliers
            missing_pct = df.isnull().mean().mean() * 100
            duplicate_count = df.duplicated().sum()
            quality_score = max(0, 100 - (missing_pct * 2) - (min(10, duplicate_count/len(df) * 1000)))
            
            outliers = {}
            for col in numeric_cols[:5]:
                q1 = df[col].quantile(0.25)
                q3 = df[col].quantile(0.75)
                iqr = q3 - q1
                outlier_count = ((df[col] < (q1 - 1.5 * iqr)) | (df[col] > (q3 + 1.5 * iqr))).sum()
                outliers[col] = int(outlier_count)

            # Smart Analysis: Auto-identify important distributions
            distributions = {}
            # Handle Dates for trend charts
            for col in date_cols[:2]:
                try:
                    df_date = pd.to_datetime(df[col], errors='coerce').dropna()
                    if not df_date.empty:
                        distributions[f"Trend: {col}"] = df_date.dt.to_period('M').value_counts().sort_index().head(12).to_dict()
                        distributions[f"Trend: {col}"] = {str(k): v for k, v in distributions[f"Trend: {col}"].items()}
                except: continue

            for col in (cat_cols + numeric_cols)[:10]: # Limit for performance
                if col in distributions: continue
                if col in cat_cols:
                    distributions[col] = df[col].value_counts().head(5).to_dict()
                else:
                    try:
                        distributions[col] = df[col].value_counts(bins=5).to_dict()
                        distributions[col] = {str(k): v for k, v in distributions[col].items()}
                    except:
                        distributions[col] = df[col].head(5).to_dict()

            stats = {
                "insights_mode": True,
                "explorer_mode": True,
                "domain": guess_dataset_domain(df.columns.tolist(), df),
                "quality_score": round(quality_score, 1),
                "duplicates": int(duplicate_count),
                "outliers": outliers,
                "correlations": df[numeric_cols].corr().fillna(0).to_dict() if len(numeric_cols) > 1 else {},
                "distributions": distributions,
                "summary": df.describe().to_dict(),
                "column_types": {col: str(df[col].dtype) for col in df.columns}
            }
            return {
                "success": True,
                "metrics": stats,
                "preview": df.head(50).fillna("").to_dict(orient='records'),
                "group_rates": {},
                "ai_report": f"Universal Analysis: Successfully parsed this {stats['domain']}. Integrity check shows a {quality_score:.1f}% quality rating."
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
            "preview": df.head(50).fillna("").to_dict(orient='records'),
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
