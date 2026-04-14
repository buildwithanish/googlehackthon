import google.generativeai as genai
import os

def generate_bias_report(metrics_results, group_rates, sensitive_feature, target_variable, api_key):
    if not api_key:
        return "⚠️ Please provide a valid Google Gemini API Key in the sidebar to generate the report."
    
    genai.configure(api_key=api_key)
    
    try:
        # Use gemini-1.5-flash for fast responses
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f\"\"\"
        Act as an expert AI Ethics and Fairness Analyst. 
        I have evaluated an ML dataset/model for bias. 
        Target Variable: {target_variable}
        Protected/Sensitive Attribute: {sensitive_feature}
        
        Here are the Fairness Metrics Calculated:
        - Demographic Parity Difference: {metrics_results.get('Demographic Parity Difference', 'N/A')}
        - Disparate Impact (Ratio): {metrics_results.get('Disparate Impact (Ratio)', 'N/A')}
        - Equal Opportunity Difference: {metrics_results.get('Equal Opportunity Difference', 'N/A')}
        
        Group-wise positive outcome rates:
        {group_rates}
        
        Please provide:
        1. A clear, non-technical explanation of what these metrics mean in this specific context.
        2. Whether significant bias is detected against any group based on these metrics. (Note: Disparate Impact < 0.8 is generally considered biased).
        3. 3 actionable mitigation suggestions to reduce this bias in the dataset or the model.
        
        Format the response in Markdown with clear headings and bullet points.
        \"\"\"
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"❌ Error generating report from Gemini: {str(e)}"
