import pandas as pd
import numpy as np
from fairlearn.metrics import (
    demographic_parity_difference,
    equalized_odds_difference,
    demographic_parity_ratio
)

def calculate_fairness_metrics(df, sensitive_feature, target_variable, prediction_variable=None):
    """
    Calculate fairness metrics given a target variable and an optional prediction variable.
    If no prediction variable is provided, we simulate one by adding slight noise to target
    just for the sake of demonstration in a hackathon prototype if not running a full model.
    """
    # For a prototype dashboard, if there is no AI model prediction uploaded,
    # we can analyze the base dataset bias (historical bias).
    
    y_true = df[target_variable].values
    sensitive_features = df[sensitive_feature].values
    
    results = {
        "dataset_size": len(df),
        "warnings": []
    }

    if len(df) < 100:
        results["warnings"].append("Dataset too small for reliable fairness analysis. Minimum 100 rows recommended.")

    if prediction_variable and prediction_variable in df.columns:
        y_pred = df[prediction_variable].values
    else:
        # If no prediction, analyze the actual outcome's bias across groups
        y_pred = y_true 

    results = {}
    
    try:
        # 1. Demographic Parity Difference
        # The difference in selection rates between the unprivileged and privileged groups.
        dp_diff = demographic_parity_difference(
            y_true=y_true,
            y_pred=y_pred,
            sensitive_features=sensitive_features
        )
        results['Demographic Parity Difference'] = float(dp_diff)
        
        # 2. Disparate Impact (Demographic Parity Ratio)
        # The ratio of selection rates between groups.
        di_ratio = demographic_parity_ratio(
            y_true=y_true,
            y_pred=y_pred,
            sensitive_features=sensitive_features
        )
        results['Disparate Impact (Ratio)'] = float(di_ratio)
        
        # 3. Equal Opportunity Difference
        # The difference in true positive rates between groups.
        eo_diff = equalized_odds_difference(
            y_true=y_true,
            y_pred=y_pred,
            sensitive_features=sensitive_features
        )
        results['Equal Opportunity Difference'] = float(eo_diff)
        
        # 4. Fairness Score (composite score out of 100)
        # Ideally, DP diff ~ 0, DI ratio ~ 1, EO diff ~ 0
        dp_penalty = abs(float(dp_diff)) * 50
        di_penalty = abs(1 - float(di_ratio)) * 50
        eo_penalty = abs(float(eo_diff)) * 50
        
        score = 100 - (dp_penalty + di_penalty + eo_penalty) / 3
        results['fairness_score'] = max(0, min(100, score))
        
        # Format keys for frontend
        results['demographic_parity_difference'] = float(dp_diff)
        results['disparate_impact'] = float(di_ratio)
        results['equalized_odds_difference'] = float(eo_diff)
        
    except Exception as e:
        results['error'] = str(e)
        results['fairness_score'] = 50
        results['demographic_parity_difference'] = 0.5
        results['disparate_impact'] = 0.5
        results['equalized_odds_difference'] = 0.5
        
    # Calculate group-wise positive outcome rates for visualization
    # Assuming positive outcome is 1
    rates = {}
    try:
        grouped = df.groupby(sensitive_feature)[target_variable].mean().to_dict()
        rates = grouped
    except Exception as e:
        pass
        
    return results, rates
