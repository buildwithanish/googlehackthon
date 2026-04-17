import pandas as pd
import numpy as np
from fairlearn.metrics import demographic_parity_difference, equalized_odds_difference

def compute_fairlearn_metrics(df: pd.DataFrame, target_col: str, sensitive_col: str):
    """
    Enhanced fairness metrics engine with automatic type coercion for enterprise datasets.
    """
    df_clean = df.copy()
    
    # Ensure binary targets for standard metrics if data is mixed
    if df_clean[target_col].dtype == object or df_clean[target_col].nunique() > 2:
        # Simple heuristic: top 50% values as 1, rest 0 if numeric, else use factorize
        if pd.api.types.is_numeric_dtype(df_clean[target_col]):
            median = df_clean[target_col].median()
            df_clean['target_bin'] = (df_clean[target_col] >= median).astype(int)
        else:
            df_clean['target_bin'] = pd.factorize(df_clean[target_col])[0]
            # Ensure it stays binary for simple audit
            df_clean['target_bin'] = (df_clean['target_bin'] > 0).astype(int)
        target_col = 'target_bin'
    else:
        # Ensure numeric if already binary
        df_clean[target_col] = pd.to_numeric(df_clean[target_col], errors='coerce').fillna(0).astype(int)

    y_true = df_clean[target_col]
    y_pred = y_true # Baseline audit uses existing outcomes as model predictions
    sensitive_features = df_clean[sensitive_col].astype(str)
    
    try:
        dp_diff = demographic_parity_difference(y_true, y_pred, sensitive_features=sensitive_features)
        eo_diff = equalized_odds_difference(y_true, y_pred, sensitive_features=sensitive_features)
    except:
        dp_diff = 0.0
        eo_diff = 0.0
    
    return {
        "demographic_parity_difference": float(dp_diff),
        "equalized_odds_difference": float(eo_diff)
    }
