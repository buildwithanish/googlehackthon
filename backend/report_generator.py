"""
backend/report_generator.py
FairAI – Generates structured JSON and Markdown bias audit reports.
Author: Anish | Team Synapse Squad Hub
"""

from __future__ import annotations
import json
from datetime import datetime
from typing import Any


def generate_markdown_report(
    metrics: dict[str, Any],
    ai_results: dict[str, Any],
    target_col: str,
    sensitive_col: str,
    filename: str,
    n_samples: int = 0,
) -> str:
    """
    Generates a full Markdown bias audit report.
    Returns the Markdown string (can be saved as .md or .txt).
    """
    score = metrics.get("fairness_score", 0)
    dpd = metrics.get("demographic_parity_difference", 0)
    eod = metrics.get("equalized_odds_difference", 0)
    di = metrics.get("disparate_impact", 0)

    bias_level = "HIGH" if score < 60 else "MODERATE" if score < 80 else "LOW"
    bias_icon = "[!] HIGH BIAS" if score < 60 else "[~] MODERATE BIAS" if score < 80 else "[OK] LOW BIAS"

    group_rows = ""
    for g in metrics.get("group_positive_rates", {}).items():
        group, rate = g
        pct = round(rate * 100, 1)
        group_rows += f"| {group} | {pct}% | {'PASS' if rate >= 0.3 else 'FAIL'} |\n"

    recs = ""
    ai_recs = ai_results.get("recommendations", "")
    if ai_recs:
        recs = "\n".join(f"- {line.strip()}" for line in ai_recs.strip().split("\n") if line.strip())

    report = f"""# FairAI Bias Audit Report
> Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}  
> Developed by Anish | Team Synapse Squad Hub

---

## {bias_icon}

| Field              | Value                  |
|--------------------|------------------------|
| Dataset            | `{filename}`           |
| Target Column      | `{target_col}`         |
| Sensitive Column   | `{sensitive_col}`      |
| Total Samples      | {n_samples:,}          |
| Bias Level         | **{bias_level}**       |

---

## Fairness Metrics

| Metric                         | Value     | Threshold | Status |
|-------------------------------|-----------|-----------|--------|
| Fairness Score                | {score}/100 | ≥ 80    | {'PASS' if score >= 80 else 'FAIL'} |
| Demographic Parity Difference | {dpd:.4f} | ≤ 0.10   | {'PASS' if dpd <= 0.1 else 'FAIL'} |
| Equalized Odds Difference     | {eod:.4f} | ≤ 0.10   | {'PASS' if eod <= 0.1 else 'FAIL'} |
| Disparate Impact Ratio        | {di:.4f}  | ≥ 0.80   | {'PASS' if di >= 0.8 else 'FAIL'} |

---

## Group-Level Approval Rates

| Group | Approval Rate | Status |
|-------|--------------|--------|
{group_rows}

---

## AI Bias Explanation

{ai_results.get('explanation', '_Not generated — provide Gemini API key_')}

---

## Fairness Summary

{ai_results.get('report_summary', '_Not generated — provide Gemini API key_')}

---

## Mitigation Recommendations

{recs or '- Balance training data across demographic groups\\n- Apply Fairlearn Reweighing preprocessing\\n- Calibrate group-specific decision thresholds\\n- Use Adversarial Debiasing during model training'}

---

## Legal & Regulatory Compliance

| Regulation | Metric | Result |
|-----------|--------|--------|
| EEOC 4/5ths Rule | Disparate Impact ≥ 0.80 | {'COMPLIANT' if di >= 0.8 else 'NON-COMPLIANT'} |
| EU AI Act (High Risk) | Bias monitoring required | {'OK' if score >= 80 else 'ACTION REQUIRED'} |
| CFPB Fair Lending | Equal Opportunity | {'PASS' if eod <= 0.1 else 'REVIEW REQUIRED'} |

---

*FairAI v2.0 | Powered by Fairlearn + IBM AIF360 + Google Gemini AI*  
*Developed by Anish | Team Synapse Squad Hub | Google Solution Challenge 2026*
"""
    return report


def generate_json_report(
    metrics: dict[str, Any],
    ai_results: dict[str, Any],
    dataset_info: dict[str, Any],
) -> dict[str, Any]:
    """
    Returns a structured JSON report dict for API responses or download.
    """
    score = metrics.get("fairness_score", 0)
    return {
        "report_metadata": {
            "generated_at": datetime.utcnow().isoformat(),
            "version": "2.0.0",
            "platform": "FairAI – Bias Detection Platform",
            "developer": "Anish | Team Synapse Squad Hub",
        },
        "dataset_info": dataset_info,
        "bias_verdict": {
            "level": "HIGH" if score < 60 else "MODERATE" if score < 80 else "LOW",
            "fairness_score": score,
            "action_required": score < 80,
            "legal_compliant": metrics.get("disparate_impact", 0) >= 0.8,
        },
        "metrics": {
            "fairness_score": score,
            "demographic_parity_difference": metrics.get("demographic_parity_difference"),
            "equalized_odds_difference": metrics.get("equalized_odds_difference"),
            "disparate_impact": metrics.get("disparate_impact"),
            "group_positive_rates": metrics.get("group_positive_rates", {}),
            "bias_alert": metrics.get("bias_alert", False),
        },
        "ai_analysis": {
            "explanation": ai_results.get("explanation", ""),
            "summary": ai_results.get("report_summary", ""),
            "recommendations": ai_results.get("recommendations", ""),
        },
    }
