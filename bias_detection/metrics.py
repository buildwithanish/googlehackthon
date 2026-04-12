"""
bias_detection/metrics.py
Core fairness metrics computation using fairlearn and scikit-learn.
Supports: Demographic Parity, Equal Opportunity, Disparate Impact.
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

try:
    from fairlearn.metrics import (
        demographic_parity_difference,
        equalized_odds_difference,
        MetricFrame,
    )
    FAIRLEARN_AVAILABLE = True
except ImportError:
    FAIRLEARN_AVAILABLE = False


# ── Helpers ──────────────────────────────────────────────────────────────────

def _encode_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Label-encode all object/category columns in a copy of df."""
    df_enc = df.copy()
    for col in df_enc.select_dtypes(include=["object", "category"]).columns:
        le = LabelEncoder()
        df_enc[col] = le.fit_transform(df_enc[col].astype(str))
    return df_enc


def _train_proxy_model(df: pd.DataFrame, target_col: str):
    """Train a simple logistic regression model as a proxy predictor."""
    df_enc = _encode_dataframe(df)
    X = df_enc.drop(columns=[target_col])
    y = df_enc[target_col]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train, y_train)
    # Return predictions aligned to the full dataset (use all rows)
    y_pred_full = model.predict(df_enc.drop(columns=[target_col]))
    return y_pred_full, df_enc[target_col].values


# ── Fairness Score ────────────────────────────────────────────────────────────

def _overall_fairness_score(metrics: dict) -> float:
    """
    Aggregate fairness score 0–100.
    100 = perfectly fair; lower = more biased.
    Based on penalising large Demographic Parity Difference,
    Equalized Odds Difference, and Disparate Impact deviation from 1.
    """
    penalties = []

    dp = abs(metrics.get("demographic_parity_difference", 0.0))
    penalties.append(dp)

    eo = abs(metrics.get("equalized_odds_difference", 0.0))
    penalties.append(eo)

    di = metrics.get("disparate_impact", 1.0)
    di_penalty = abs(1.0 - di) if di is not None else 0.0
    penalties.append(min(di_penalty, 1.0))

    avg_penalty = np.mean(penalties)
    score = max(0.0, 100.0 * (1.0 - avg_penalty))
    return round(score, 2)


# ── Main Public API ───────────────────────────────────────────────────────────

def compute_fairness_metrics(
    df: pd.DataFrame,
    target_col: str,
    sensitive_col: str,
) -> dict:
    """
    Compute Demographic Parity Difference, Equalized Odds Difference,
    Disparate Impact, and group-level positive-rate breakdown.

    Parameters
    ----------
    df            : The full input DataFrame (raw, may contain categoricals).
    target_col    : Name of the binary outcome/label column (0/1 or category).
    sensitive_col : Name of the protected/sensitive attribute column.

    Returns
    -------
    dict containing:
        - demographic_parity_difference  (float)
        - equalized_odds_difference      (float)
        - disparate_impact               (float)
        - group_positive_rates           (dict  {group_value: rate})
        - fairness_score                 (float 0-100)
        - n_samples                      (int)
        - n_groups                       (int)
        - bias_detected                  (bool)
    """
    if df is None or df.empty:
        raise ValueError("DataFrame is empty or None.")
    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found.")
    if sensitive_col not in df.columns:
        raise ValueError(f"Sensitive column '{sensitive_col}' not found.")

    df_work = df.copy().dropna(subset=[target_col, sensitive_col])

    # Encode sensitive attribute and target for numeric operations
    df_enc = _encode_dataframe(df_work)
    sensitive_values = df_work[sensitive_col].astype(str)

    # ── Proxy model predictions ──────────────────────────────────────────
    y_pred, y_true = _train_proxy_model(df_work, target_col)

    # ── Demographic Parity Difference ────────────────────────────────────
    if FAIRLEARN_AVAILABLE:
        dp_diff = demographic_parity_difference(
            y_true=y_true,
            y_pred=y_pred,
            sensitive_features=sensitive_values.values,
        )
        eo_diff = equalized_odds_difference(
            y_true=y_true,
            y_pred=y_pred,
            sensitive_features=sensitive_values.values,
        )
    else:
        # Fallback: manual demographic parity difference
        groups = sensitive_values.unique()
        positive_rates = {}
        for g in groups:
            mask = sensitive_values == g
            positive_rates[g] = y_pred[mask].mean()
        rates = list(positive_rates.values())
        dp_diff = float(max(rates) - min(rates)) if rates else 0.0
        eo_diff = dp_diff  # simplified fallback

    # ── Disparate Impact ─────────────────────────────────────────────────
    groups = sensitive_values.unique()
    group_rates = {}
    for g in groups:
        mask = (sensitive_values == g).values
        if mask.sum() > 0:
            group_rates[str(g)] = round(float(y_pred[mask].mean()), 4)

    sorted_rates = sorted(group_rates.values())
    if len(sorted_rates) >= 2 and sorted_rates[-1] != 0:
        disparate_impact = round(sorted_rates[0] / sorted_rates[-1], 4)
    else:
        disparate_impact = 1.0

    metrics = {
        "demographic_parity_difference": round(float(dp_diff), 4),
        "equalized_odds_difference": round(float(eo_diff), 4),
        "disparate_impact": disparate_impact,
        "group_positive_rates": group_rates,
        "n_samples": len(df_work),
        "n_groups": len(groups),
    }

    metrics["fairness_score"] = _overall_fairness_score(metrics)
    # Bias is flagged if DPD > 0.1 OR Disparate Impact < 0.8 (80% rule)
    metrics["bias_detected"] = (
        abs(metrics["demographic_parity_difference"]) > 0.1
        or metrics["disparate_impact"] < 0.8
    )

    return metrics


def get_bias_summary(metrics: dict) -> str:
    """Return a short human-readable bias summary string."""
    score = metrics.get("fairness_score", 0)
    bias = metrics.get("bias_detected", False)
    dp = metrics.get("demographic_parity_difference", 0)
    di = metrics.get("disparate_impact", 1)

    if score >= 80:
        level = "LOW"
    elif score >= 60:
        level = "MODERATE"
    else:
        level = "HIGH"

    summary = (
        f"Bias Level: {level} | Fairness Score: {score}/100\n"
        f"Demographic Parity Difference: {dp:.4f} | "
        f"Disparate Impact: {di:.4f}\n"
        f"Bias Alert: {'⚠️  BIAS DETECTED' if bias else '✅ No significant bias detected'}"
    )
    return summary
