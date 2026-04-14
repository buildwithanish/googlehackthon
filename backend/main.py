import os
import sys

# Add parent directory to path so imports work correctly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
import pandas as pd
import io
from bias_detection.metrics import calculate_fairness_metrics
from bias_detection.ai_explainer import generate_bias_report

app = FastAPI(title="FairAI Backend", description="API for bias detection and fairness analysis")

class AnalysisResponse(BaseModel):
    metrics: dict
    group_rates: dict
    ai_report: str | None = None

@app.get("/")
def read_root():
    return {"message": "Welcome to FairAI API"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_dataset(
    file: UploadFile = File(...),
    sensitive_feature: str = Form(...),
    target_variable: str = Form(...),
    prediction_variable: str = Form(None),
    gemini_api_key: str = Form(None)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
        
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        if sensitive_feature not in df.columns or target_variable not in df.columns:
            raise HTTPException(status_code=400, detail="Specified columns not found in dataset")
            
        metrics, rates = calculate_fairness_metrics(
            df=df,
            sensitive_feature=sensitive_feature,
            target_variable=target_variable,
            prediction_variable=prediction_variable
        )
        
        ai_report = None
        if gemini_api_key:
            ai_report = generate_bias_report(
                metrics_results=metrics,
                group_rates=rates,
                sensitive_feature=sensitive_feature,
                target_variable=target_variable,
                api_key=gemini_api_key
            )
            
        return {"metrics": metrics, "group_rates": rates, "ai_report": ai_report}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
