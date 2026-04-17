import google.generativeai as genai
import os

def generate_bias_report(metrics, rates, sensitive_col, target_col, api_key):
    """
    Generates a high-impact, enterprise-grade executive summary for companies.
    """
    if not api_key:
        return "⚠️ Please provide a valid Google Gemini API Key to generate the report."

    genai.configure(api_key=api_key)
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        You are a Senior AI Governance Consultant specializing in Algorithmic Fairness for Startups and VC-backed companies.
        
        Analyze these forensic audit results for the dataset:
        - Target Variable: {target_col}
        - Sensitive Pivot: {sensitive_col}
        - Demographic Parity Gap: {metrics.get('demographic_parity_difference', metrics.get('Demographic Parity Difference', 'N/A'))}
        - Equalized Odds Gap: {metrics.get('equalized_odds_difference', metrics.get('Equal Opportunity Difference', 'N/A'))}
        - Group-wise Distribution Rates: {rates}
        
        Write a high-performance "Remediation Roadmap" for a Company CTO/CEO. 
        Use exactly this Markdown structure:
        
        ### 📊 Executive Audit Summary
        (A 2-sentence summary of the fairness risk and business impact)
        
        ### ⚖️ Critical Disparities Detected
        (Highlight the most biased demographic slice in plain English)
        
        ### 🛡️ Startup Remediation Roadmap
        (3 Actionable and technical steps for their engineering team. Be business-oriented)
        
        ### 🚀 Governance & Compliance Outlook
        (Explain how fixing this improves brand trust and avoids regulatory risks like GDPR or the AI Act)
        
        Keep it professional, high-impact, and strictly markdown formatted.
        """
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Governance Engine Offline: {str(e)}"
