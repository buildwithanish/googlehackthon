import pandas as pd
import shap
import numpy as np
from sklearn.ensemble import RandomForestClassifier

def get_shap_explanations(df, target_col):
    """
    Generate SHAP global feature importance for the dataset.
    Trains a quick Random Forest model internally to get the 'model' to explain.
    """
    try:
        # 1. Prepare data (drop non-numeric for a quick model)
        X = df.select_dtypes(include=['number']).drop(columns=[target_col], errors='ignore')
        y = df[target_col]
        
        if len(X.columns) == 0:
            return {"error": "No numeric columns for SHAP analysis"}

        # 2. Train a fast model
        model = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
        model.fit(X, y)
        
        # 3. Calculate SHAP values
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(X)
        
        # Handle cases where shap_values is a list (for classification)
        if isinstance(shap_values, list):
            # For binary classification, take importance for the positive class
            importance = np.abs(shap_values[1]).mean(axis=0)
        else:
            importance = np.abs(shap_values).mean(axis=0)
            
        feature_importance = pd.DataFrame({
            'feature': X.columns,
            'importance': importance
        }).sort_values(by='importance', ascending=False).head(10).to_dict(orient='records')
        
        return feature_importance
        
    except Exception as e:
        return {"error": str(e)}
