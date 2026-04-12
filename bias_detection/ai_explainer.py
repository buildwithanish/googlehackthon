"""
bias_detection/ai_explainer.py
Google Gemini API integration for AI-powered bias explanation and recommendations.
"""

import os
import json

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


# ── Gemini Setup ─────────────────────────────────────────────────────────────

def _configure_genai(api_key: str = None):
    """Configure the Gemini client with the given or environment API key."""
    if not GENAI_AVAILABLE:
        raise ImportError("google-generativeai is not installed. Run: pip install google-generativeai")
    
    key = api_key or os.environ.get("GEMINI_API_KEY", "")
    if not key:
        raise ValueError("No Gemini API key provided. Set GEMINI_API_KEY env var or pass api_key.")
    
    genai.configure(api_key=key)
    return genai.GenerativeModel("gemini-1.5-flash")


# ── Prompt Builders ───────────────────────────────────────────────────────────

def _build_explanation_prompt(metrics: dict, target_col: str, sensitive_col: str, dataset_info: dict) -> str:
    """Build the prompt for bias explanation."""
    return f"""You are an expert in AI fairness, algorithmic bias, and machine learning ethics.

Analyze the following fairness metrics computed on a dataset and provide a clear, concise explanation.

DATASET INFORMATION:
- Total Samples: {dataset_info.get('n_samples', 'N/A')}
- Target Variable: {target_col}
- Protected Attribute: {sensitive_col}
- Number of Groups: {metrics.get('n_groups', 'N/A')}
- Group Positive Rates: {json.dumps(metrics.get('group_positive_rates', {}), indent=2)}

FAIRNESS METRICS:
- Demographic Parity Difference: {metrics.get('demographic_parity_difference', 0):.4f}
  (Ideal = 0; measures difference in positive prediction rates across groups)
- Equalized Odds Difference: {metrics.get('equalized_odds_difference', 0):.4f}
  (Ideal = 0; measures difference in true/false positive rates across groups)
- Disparate Impact Ratio: {metrics.get('disparate_impact', 1):.4f}
  (Ideal = 1.0; ratio of positive rates — values < 0.8 violate the "80% rule")
- Overall Fairness Score: {metrics.get('fairness_score', 0)}/100
- Bias Detected: {metrics.get('bias_detected', False)}

Please provide:
1. **Plain Language Explanation** (2-3 paragraphs): What do these metrics mean for real-world impact? Who might be harmed?
2. **Root Cause Analysis** (1-2 paragraphs): What commonly causes this type of bias in datasets?
3. **Severity Assessment**: Rate the bias as Low / Moderate / High and justify why.

Keep the tone professional but accessible to non-technical stakeholders.
"""


def _build_recommendations_prompt(metrics: dict, sensitive_col: str) -> str:
    """Build the prompt for bias mitigation recommendations."""
    return f"""You are an expert in AI fairness and bias mitigation strategies.

Based on the following fairness analysis results for the protected attribute '{sensitive_col}':
- Demographic Parity Difference: {metrics.get('demographic_parity_difference', 0):.4f}
- Disparate Impact: {metrics.get('disparate_impact', 1):.4f}
- Fairness Score: {metrics.get('fairness_score', 0)}/100
- Bias Detected: {metrics.get('bias_detected', False)}

Provide EXACTLY 5 specific, actionable bias mitigation recommendations. For each recommendation:
1. Name the technique (e.g., "Reweighting", "Adversarial Debiasing")
2. Explain how to implement it in 2-3 sentences
3. State the expected impact

Format each recommendation as:
**[Number]. [Technique Name]**
Implementation: [how to do it]
Expected Impact: [what it achieves]

Focus on practical solutions appropriate for a machine learning pipeline.
"""


def _build_report_summary_prompt(metrics: dict, target_col: str, sensitive_col: str) -> str:
    """Build the prompt for the executive report summary."""
    return f"""You are writing a concise executive summary for an AI fairness audit report.

AUDIT DETAILS:
- Target Outcome Variable: {target_col}
- Protected Attribute Analyzed: {sensitive_col}
- Fairness Score: {metrics.get('fairness_score', 0)}/100
- Metrics: DPD={metrics.get('demographic_parity_difference', 0):.4f}, DI={metrics.get('disparate_impact', 1):.4f}
- Bias Status: {"BIAS DETECTED" if metrics.get('bias_detected') else "NO SIGNIFICANT BIAS"}

Write a 3-4 sentence executive summary suitable for a compliance or legal team. 
Include the key finding, the risk level, and one top recommendation.
Keep it under 150 words.
"""


# ── Public API ────────────────────────────────────────────────────────────────

def generate_explanation(
    metrics: dict,
    target_col: str,
    sensitive_col: str,
    dataset_info: dict = None,
    api_key: str = None,
) -> dict:
    """
    Generate AI-powered bias explanation, recommendations, and report summary.

    Parameters
    ----------
    metrics       : Output dict from compute_fairness_metrics().
    target_col    : Name of the target/label column.
    sensitive_col : Name of the protected attribute column.
    dataset_info  : Optional dict with extra dataset context.
    api_key       : Gemini API key (falls back to GEMINI_API_KEY env var).

    Returns
    -------
    dict with keys:
        - explanation      (str)
        - recommendations  (str)
        - report_summary   (str)
        - error            (str | None)
    """
    if dataset_info is None:
        dataset_info = {"n_samples": metrics.get("n_samples", "N/A")}

    result = {
        "explanation": "",
        "recommendations": "",
        "report_summary": "",
        "error": None,
    }

    try:
        model = _configure_genai(api_key)

        # Generate explanation
        exp_prompt = _build_explanation_prompt(metrics, target_col, sensitive_col, dataset_info)
        exp_response = model.generate_content(exp_prompt)
        result["explanation"] = exp_response.text

        # Generate recommendations
        rec_prompt = _build_recommendations_prompt(metrics, sensitive_col)
        rec_response = model.generate_content(rec_prompt)
        result["recommendations"] = rec_response.text

        # Generate report summary
        rep_prompt = _build_report_summary_prompt(metrics, target_col, sensitive_col)
        rep_response = model.generate_content(rep_prompt)
        result["report_summary"] = rep_response.text

    except ValueError as e:
        result["error"] = f"API Key Error: {e}"
    except Exception as e:
        result["error"] = f"Gemini API Error: {type(e).__name__}: {e}"

    return result
