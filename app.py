import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from bias_detection.metrics import calculate_fairness_metrics
from bias_detection.ai_explainer import generate_bias_report

# Configure Page
st.set_page_config(
    page_title="FairAI - Bias Detection Platform", 
    page_icon="⚖️", 
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for UI styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1E3A8A;
        margin-bottom: 0px;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #4B5563;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #F3F4F6;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        text-align: center;
    }
    .metric-value {
        font-size: 2rem;
        font-weight: bold;
        color: #2563EB;
    }
    .metric-label {
        font-size: 1rem;
        color: #4B5563;
        font-weight: 500;
    }
    .team-card {
        background-color: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        margin-bottom: 10px;
        border-left: 5px solid #3b82f6;
        display: flex;
        align-items: center;
    }
    .team-info {
        margin-left: 15px;
    }
    .team-name {
        font-weight: bold;
        font-size: 1.1rem;
        color: #1f2937;
        margin: 0;
    }
    .team-role {
        color: #eab308;
        font-weight: bold;
        font-size: 0.9rem;
    }
    .team-email {
        color: #6b7280;
        font-size: 0.9rem;
        margin: 0;
    }
    .avatar {
        width: 50px;
        height: 50px;
        border-radius: 25px;
        background-color: #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/3254/3254068.png", width=80)
    st.title("FairAI Config")
    
    api_key = st.text_input("Google Gemini API Key", type="password", help="Needed for AI Bias Explanations")
    if api_key:
        os.environ['GEMINI_API_KEY'] = api_key
    
    st.markdown("---")
    st.markdown("### Hackathon Prototype")
    st.markdown("Easily detect biases in datasets regarding Gender, Age, Income, or Location.")

# Sidebar - Team Section
def render_team_member(name, email, emoji, is_leader=False):
    role_html = f"<span class='team-role'>(Leader)</span>" if is_leader else ""
    html = f"""
    <div class="team-card">
        <div class="avatar">{emoji}</div>
        <div class="team-info">
            <p class="team-name">{name} {role_html}</p>
            <p class="team-email">{email}</p>
        </div>
    </div>
    """
    return html

# App Header
st.markdown("<h1 class='main-header'>⚖️ FairAI</h1>", unsafe_allow_html=True)
st.markdown("<p class='sub-header'>Bias Detection and Fairness Analysis Platform</p>", unsafe_allow_html=True)

# Main Application Tabs
tab1, tab2, tab3 = st.tabs(["📊 Dashboard & Analysis", "📄 Generative AI Report", "👨‍💻 Team Members"])

with tab1:
    st.header("Step 1: Upload Dataset")
    uploaded_file = st.file_uploader("Upload your dataset (CSV)", type=["csv"])
    
    if uploaded_file is not None:
        df = pd.read_csv(uploaded_file)
        
        with st.expander("Preview Dataset"):
            st.dataframe(df.head())
            st.write(f"Dataset Shape: {df.shape[0]} rows, {df.shape[1]} columns")
            
        st.header("Step 2: Configuration")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            target_col = st.selectbox("Select Target Variable (Outcome)", df.columns)
            
        with col2:
            sensitive_col = st.selectbox("Select Sensitive/Protected Attribute (e.g. Gender, Age, Race)", df.columns)
            
        with col3:
            prediction_col = st.selectbox("Select Prediction Variable (Optional)", ["None"] + list(df.columns))
            if prediction_col == "None":
                prediction_col = None
                
        if st.button("Analyze Fairness 🚀", type="primary"):
            with st.spinner("Analyzing dataset metrics..."):
                # Save to session state to share with Tab 2
                st.session_state['df'] = df
                st.session_state['target'] = target_col
                st.session_state['sensitive'] = sensitive_col
                
                metrics, rates = calculate_fairness_metrics(
                    df, sensitive_col, target_col, prediction_col
                )
                
                st.session_state['metrics'] = metrics
                st.session_state['rates'] = rates
                
                st.success("Analysis Complete!")
                
                st.header("Fairness Metrics")
                
                m1, m2, m3 = st.columns(3)
                
                # Render Metrics
                with m1:
                    dp = metrics.get('Demographic Parity Difference', 0)
                    st.markdown(f"""
                    <div class="metric-card">
                        <div class="metric-value">{dp:.4f}</div>
                        <div class="metric-label">Demographic Parity Diff</div>
                        <div style="font-size: 12px; color: gray;">Ideal: 0.0</div>
                    </div>
                    """, unsafe_allow_html=True)
                    
                with m2:
                    di = metrics.get('Disparate Impact (Ratio)', 1)
                    color = "red" if di < 0.8 else "green"
                    st.markdown(f"""
                    <div class="metric-card">
                        <div class="metric-value" style="color: {color};">{di:.4f}</div>
                        <div class="metric-label">Disparate Impact Ratio</div>
                        <div style="font-size: 12px; color: gray;">Ideal: > 0.8</div>
                    </div>
                    """, unsafe_allow_html=True)
                    
                with m3:
                    eo = metrics.get('Equal Opportunity Difference', 0)
                    st.markdown(f"""
                    <div class="metric-card">
                        <div class="metric-value">{eo:.4f}</div>
                        <div class="metric-label">Equal Opportunity Diff</div>
                        <div style="font-size: 12px; color: gray;">Ideal: 0.0</div>
                    </div>
                    """, unsafe_allow_html=True)
                
                st.markdown("<br>", unsafe_allow_html=True)
                
                # Visualizations
                st.header("Bias Visualization")
                
                v1, v2 = st.columns(2)
                
                with v1:
                    # Bar Chart for Positive Outcome Rates
                    rates_df = pd.DataFrame(list(rates.items()), columns=[sensitive_col, 'Positive Rate'])
                    fig1 = px.bar(rates_df, x=sensitive_col, y='Positive Rate', color=sensitive_col, 
                                 title=f"Positive Outcome Rate by {sensitive_col}")
                    st.plotly_chart(fig1, use_container_width=True)
                    
                with v2:
                    # Pie Chart for Distribution
                    dist_df = df[sensitive_col].value_counts().reset_index()
                    dist_df.columns = [sensitive_col, 'Count']
                    fig2 = px.pie(dist_df, values='Count', names=sensitive_col, 
                                 title=f"Distribution of {sensitive_col}", hole=0.3)
                    st.plotly_chart(fig2, use_container_width=True)

with tab2:
    st.header("🤖 AI Bias Explanation & Recommendations")
    st.write("Generate a comprehensive bias report and mitigation strategies using Google Gemini API.")
    
    if 'metrics' in st.session_state:
        if st.button("Generate AI Insights ✨", type="primary"):
            if not api_key:
                st.error("Please enter your Google Gemini API Key in the sidebar.")
            else:
                with st.spinner("Generating Insights... This may take a few seconds."):
                    report = generate_bias_report(
                        metrics_results=st.session_state['metrics'],
                        group_rates=st.session_state['rates'],
                        sensitive_feature=st.session_state['sensitive'],
                        target_variable=st.session_state['target'],
                        api_key=api_key
                    )
                    st.markdown("### Fairness Report")
                    st.markdown(report)
                    
                    # Bonus Feature: Downloadble Summary
                    st.download_button(
                        label="Download Report as Markdown",
                        data=report,
                        file_name="fairness_report.md",
                        mime="text/markdown"
                    )
    else:
        st.info("Please upload a dataset and run the analysis in Tab 1 first.")

with tab3:
    st.header("👨‍💻 Team Members")
    st.write("Meet the brilliant minds behind FairAI:")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown(render_team_member("Amrit Anand", "rounakjha122@gmail.com", "🧑🏻"), unsafe_allow_html=True)
        st.markdown(render_team_member("Subham Sharma", "subhamsharma765688@gmail.com", "👨🏼‍💻"), unsafe_allow_html=True)
        
    with col2:
        st.markdown(render_team_member("Kapil Vishwakarma", "kapilbhai758@gmail.com", "👤"), unsafe_allow_html=True)
        st.markdown(render_team_member("Anish Raj", "anishkumar9905287@gmail.com", "👨🏽‍🦱", is_leader=True), unsafe_allow_html=True)
        
    st.markdown("<br><hr><center><p>Built with ❤️ for the Hackathon</p></center>", unsafe_allow_html=True)

