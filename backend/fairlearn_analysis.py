import pandas as pd
from fairlearn.metrics import demographic_parity_difference, equalized_odds_difference

def compute_fairlearn_metrics(df: pd.DataFrame, target_col: str, sensitive_col: str):
    """
    Computes fairness metrics using Microsoft Fairlearn.
    Assumes prediction columns are passed. Since we only evaluate datasets directly here
    for base bias, we simulate predictions as the target column.
    """
    # Assuming the target variables represent the 'decisions' temporarily to assess historical bias
    y_true = df[target_col]
    y_pred = df[target_col] # If model not provided, use y_true to measure raw dataset bias
    sensitive_features = df[sensitive_col]
    
    dp_diff = demographic_parity_difference(y_true, y_pred, sensitive_features=sensitive_features)
    eo_diff = equalized_odds_difference(y_true, y_pred, sensitive_features=sensitive_features)
    
    return {
        "demographic_parity_difference": dp_diff,
        "equalized_odds_difference": eo_diff
    }
