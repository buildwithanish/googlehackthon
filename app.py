"""
app.py – FairAI Streamlit Dashboard
Main entry point. Run with: streamlit run app.py
"""

import os
import io
import json
import time

import numpy as np
import pandas as pd
import streamlit as st

# ── Page Config (must be FIRST Streamlit call) ────────────────────────────────
st.set_page_config(
    page_title="FairAI – Bias Detection Platform",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Internal Imports ──────────────────────────────────────────────────────────
from bias_detection.metrics    import compute_fairness_metrics, get_bias_summary
from bias_detection.ai_explainer import generate_explanation
from dashboard.visualizations  import (
    plot_demographic_parity,
    plot_equal_opportunity,
    plot_disparate_impact,
    plot_fairness_gauge,
    plot_group_distribution,
    plot_metrics_comparison,
)
from dashboard.reporting import generate_pdf_report, generate_markdown_report

# ── Custom CSS ────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap');

/* ─── Global ─────────────────────────────── */
html, body, [class*="css"] {
    font-family: 'Inter', sans-serif !important;
}
.stApp { background: #0E1117; }

/* ─── Hero Banner ────────────────────────── */
.hero-banner {
    background: linear-gradient(135deg, #1A1D2E 0%, #16213E 50%, #0F3460 100%);
    border: 1px solid rgba(108,99,255,0.3);
    border-radius: 16px;
    padding: 2.5rem 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
}
.hero-title {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #6C63FF, #43CBFF, #FF6584);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
    margin: 0;
}
.hero-subtitle {
    font-size: 1.1rem;
    color: #8B8FA8;
    margin-top: 0.5rem;
}

/* ─── Metric Cards ───────────────────────── */
.metric-card {
    background: linear-gradient(135deg, #1A1D2E, #16213E);
    border: 1px solid rgba(108,99,255,0.2);
    border-radius: 12px;
    padding: 1.2rem;
    text-align: center;
    transition: border-color 0.3s;
}
.metric-card:hover { border-color: rgba(108,99,255,0.6); }
.metric-value {
    font-size: 2.2rem;
    font-weight: 700;
    line-height: 1;
}
.metric-label {
    font-size: 0.8rem;
    color: #8B8FA8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 0.4rem;
}

/* ─── Bias Alert Banner ──────────────────── */
.bias-alert-danger {
    background: linear-gradient(135deg, #3D1515, #5C2525);
    border: 2px solid #E74C3C;
    border-radius: 12px;
    padding: 1rem 1.5rem;
    color: #FF6B6B;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
}
.bias-alert-safe {
    background: linear-gradient(135deg, #153D15, #1E5C1E);
    border: 2px solid #2ECC71;
    border-radius: 12px;
    padding: 1rem 1.5rem;
    color: #58E07C;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

/* ─── Section Titles ─────────────────────── */
.section-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #EAEAEA;
    border-left: 4px solid #6C63FF;
    padding-left: 0.75rem;
    margin: 1.5rem 0 1rem;
}

/* ─── AI Output Card ─────────────────────── */
.ai-card {
    background: linear-gradient(135deg, #1A1D2E, #12152A);
    border: 1px solid rgba(67,203,255,0.3);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #C8CEDD;
}
.ai-card h4 {
    color: #43CBFF;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* ─── Sidebar ────────────────────────────── */
[data-testid="stSidebar"] {
    background: #12152A !important;
    border-right: 1px solid rgba(108,99,255,0.2);
}
[data-testid="stSidebar"] .stMarkdown h2 {
    color: #6C63FF;
}

/* ─── Tabs ───────────────────────────────── */
.stTabs [data-baseweb="tab-list"] {
    background: #1A1D2E;
    border-radius: 10px;
    gap: 4px;
    padding: 4px;
}
.stTabs [data-baseweb="tab"] {
    color: #8B8FA8;
    font-weight: 600;
}
.stTabs [aria-selected="true"] {
    background: #6C63FF !important;
    color: white !important;
    border-radius: 8px;
}

/* ─── DataFrames ─────────────────────────── */
[data-testid="stDataFrameContainer"] {
    border: 1px solid rgba(108,99,255,0.2);
    border-radius: 10px;
    overflow: hidden;
}

/* ─── Buttons ────────────────────────────── */
.stButton > button {
    background: linear-gradient(135deg, #6C63FF, #8B84FF);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    padding: 0.5rem 1.5rem;
    transition: all 0.3s;
}
.stButton > button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(108,99,255,0.4);
}

/* ─── Download buttons ───────────────────── */
.stDownloadButton > button {
    background: linear-gradient(135deg, #1A1D2E, #16213E);
    color: #6C63FF;
    border: 1px solid #6C63FF;
    border-radius: 8px;
    font-weight: 600;
}
.stDownloadButton > button:hover {
    background: #6C63FF;
    color: white;
}
</style>
""", unsafe_allow_html=True)


# ── Session State Init ────────────────────────────────────────────────────────
def init_session():
    defaults = {
        "df": None,
        "metrics": None,
        "ai_results": None,
        "filename": None,
        "analyzed": False,
    }
    for k, v in defaults.items():
        if k not in st.session_state:
            st.session_state[k] = v


init_session()


# ── Hero Banner ───────────────────────────────────────────────────────────────
st.markdown("""
<div class="hero-banner">
    <p class="hero-title">⚖️ FairAI</p>
    <p class="hero-subtitle">
        Bias Detection & Fairness Analysis Platform &nbsp;|&nbsp;
        Powered by Google Gemini · Fairlearn · Scikit-learn
    </p>
</div>
""", unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# SIDEBAR
# ═══════════════════════════════════════════════════════════════════════════════
with st.sidebar:
    st.markdown("## ⚙️ Configuration")
    st.markdown("---")

    # ── API Key ───────────────────────────────────────────────────────────────
    st.markdown("### 🔑 Gemini API Key")
    env_key = os.environ.get("GEMINI_API_KEY", "")
    if env_key:
        st.success("✅ GEMINI_API_KEY found in environment")
        api_key_input = env_key
    else:
        api_key_input = st.text_input(
            "Enter your Gemini API Key",
            type="password",
            placeholder="AIzaSy...",
            help="Get your key at https://aistudio.google.com/app/apikey",
        )
    st.markdown("---")

    # ── Dataset Upload ────────────────────────────────────────────────────────
    st.markdown("### 📂 Upload Dataset")
    uploaded_file = st.file_uploader(
        "Upload a CSV file",
        type=["csv"],
        help="Upload your dataset as a CSV file. The file should have column headers.",
    )

    if uploaded_file:
        df_raw = pd.read_csv(uploaded_file)
        st.session_state["df"]       = df_raw
        st.session_state["filename"] = uploaded_file.name
        st.session_state["analyzed"] = False
        st.session_state["metrics"]  = None
        st.session_state["ai_results"] = None
        st.success(f"✅ Loaded: {uploaded_file.name}")
        st.caption(f"Shape: {df_raw.shape[0]} rows × {df_raw.shape[1]} columns")

    # ── Sample Dataset ────────────────────────────────────────────────────────
    st.markdown("---")
    st.markdown("### 🧪 Sample Dataset")
    if st.button("Load Adult Income Sample", use_container_width=True):
        # Generate a realistic-looking synthetic dataset
        np.random.seed(42)
        n = 1000
        gender      = np.random.choice(["Male", "Female"], n, p=[0.67, 0.33])
        race        = np.random.choice(["White", "Black", "Asian", "Hispanic"], n, p=[0.70, 0.12, 0.10, 0.08])
        age         = np.random.randint(18, 65, n)
        education   = np.random.choice(["HS-grad", "Some-college", "Bachelors", "Masters", "Doctorate"], n)
        income_prob = np.where(gender == "Male", 0.35, 0.18)  # inject bias
        income      = np.array(
            [np.random.choice([">50K", "<=50K"], p=[p, 1 - p]) for p in income_prob]
        )
        sample_df = pd.DataFrame({
            "age": age,
            "gender": gender,
            "race": race,
            "education": education,
            "income": income,
        })
        st.session_state["df"]       = sample_df
        st.session_state["filename"] = "adult_income_sample.csv"
        st.session_state["analyzed"] = False
        st.session_state["metrics"]  = None
        st.session_state["ai_results"] = None
        st.success("✅ Sample dataset loaded!")
        st.rerun()

    # ── Column Selector ───────────────────────────────────────────────────────
    if st.session_state["df"] is not None:
        st.markdown("---")
        st.markdown("### 🎯 Column Selection")
        df_cols = list(st.session_state["df"].columns)

        target_col = st.selectbox(
            "Target / Label Column",
            options=df_cols,
            index=len(df_cols) - 1,
            help="The column you are predicting (e.g. income, hired, approved)",
        )
        protected_col = st.selectbox(
            "Protected Attribute",
            options=[c for c in df_cols if c != target_col],
            help="The sensitive attribute to test for bias (e.g. gender, race, age)",
        )
        st.session_state["target_col"]    = target_col
        st.session_state["protected_col"] = protected_col

        st.markdown("---")
        analyze_btn = st.button("🔍 Run Bias Analysis", use_container_width=True, type="primary")

        if analyze_btn:
            st.session_state["analyzed"]    = False
            st.session_state["ai_results"]  = None
            with st.spinner("Computing fairness metrics…"):
                try:
                    metrics = compute_fairness_metrics(
                        st.session_state["df"],
                        target_col,
                        protected_col,
                    )
                    st.session_state["metrics"]  = metrics
                    st.session_state["analyzed"] = True
                except Exception as e:
                    st.error(f"Analysis failed: {e}")

    st.markdown("---")
    st.caption("FairAI v1.0 · Hackathon Prototype")


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN CONTENT
# ═══════════════════════════════════════════════════════════════════════════════

df       = st.session_state.get("df")
metrics  = st.session_state.get("metrics")
analyzed = st.session_state.get("analyzed", False)

if df is None:
    # ── Welcome / Instructions ────────────────────────────────────────────────
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown("""
        <div class="metric-card">
            <div style="font-size:2.5rem">📊</div>
            <div class="metric-label" style="margin-top:0.5rem">Upload a CSV dataset via the sidebar to get started</div>
        </div>""", unsafe_allow_html=True)
    with col2:
        st.markdown("""
        <div class="metric-card">
            <div style="font-size:2.5rem">🔍</div>
            <div class="metric-label" style="margin-top:0.5rem">Detect Demographic Parity, Equal Opportunity & Disparate Impact</div>
        </div>""", unsafe_allow_html=True)
    with col3:
        st.markdown("""
        <div class="metric-card">
            <div style="font-size:2.5rem">🤖</div>
            <div class="metric-label" style="margin-top:0.5rem">Get AI-generated explanations and mitigation recommendations via Gemini</div>
        </div>""", unsafe_allow_html=True)

    st.markdown("---")
    st.info("👈 **Get started:** Upload a CSV file or load the sample dataset from the sidebar, then click **Run Bias Analysis**.")
    st.stop()


# ── Dataset Preview ───────────────────────────────────────────────────────────
tab1, tab2, tab3, tab4 = st.tabs(["📊 Dataset", "📈 Fairness Analysis", "🤖 AI Insights", "📄 Report"])

with tab1:
    st.markdown('<p class="section-title">Dataset Preview</p>', unsafe_allow_html=True)
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Rows", f"{len(df):,}")
    c2.metric("Columns", len(df.columns))
    c3.metric("Missing Values", int(df.isnull().sum().sum()))
    c4.metric("File", st.session_state.get("filename", "—"))

    st.dataframe(df.head(100), use_container_width=True, height=300)

    col_a, col_b = st.columns(2)
    with col_a:
        st.markdown('<p class="section-title">Column Info</p>', unsafe_allow_html=True)
        col_info = pd.DataFrame({
            "Column": df.columns,
            "Type": [str(df[c].dtype) for c in df.columns],
            "Unique Values": [df[c].nunique() for c in df.columns],
            "Missing": [df[c].isnull().sum() for c in df.columns],
        })
        st.dataframe(col_info, use_container_width=True, hide_index=True)

    with col_b:
        st.markdown('<p class="section-title">Statistical Summary</p>', unsafe_allow_html=True)
        st.dataframe(df.describe(include="all").T, use_container_width=True)


# ── Fairness Analysis Tab ─────────────────────────────────────────────────────
with tab2:
    if not analyzed or metrics is None:
        st.info("👈 Configure columns and click **Run Bias Analysis** in the sidebar.")
    else:
        target_col    = st.session_state["target_col"]
        protected_col = st.session_state["protected_col"]

        # ── Bias Status Banner ────────────────────────────────────────────────
        bias_detected = metrics.get("bias_detected", False)
        score         = metrics.get("fairness_score", 0)

        if bias_detected:
            st.markdown("""
            <div class="bias-alert-danger">
                ⚠️ BIAS DETECTED — Significant unfairness found in this dataset.
                Review mitigation recommendations in the AI Insights tab.
            </div>""", unsafe_allow_html=True)
        else:
            st.markdown("""
            <div class="bias-alert-safe">
                ✅ No Significant Bias Detected — The dataset meets fairness thresholds.
            </div>""", unsafe_allow_html=True)

        # ── Key Metrics Row ───────────────────────────────────────────────────
        st.markdown('<p class="section-title">Fairness Metrics</p>', unsafe_allow_html=True)
        m1, m2, m3, m4 = st.columns(4)

        score_color = "#2ECC71" if score >= 80 else ("#F39C12" if score >= 60 else "#E74C3C")
        dp   = metrics.get("demographic_parity_difference", 0)
        eo   = metrics.get("equalized_odds_difference", 0)
        di   = metrics.get("disparate_impact", 1)

        m1.markdown(f"""
        <div class="metric-card">
            <div class="metric-value" style="color:{score_color}">{score}</div>
            <div class="metric-label">Fairness Score / 100</div>
        </div>""", unsafe_allow_html=True)

        dp_color = "#E74C3C" if abs(dp) > 0.1 else "#2ECC71"
        m2.markdown(f"""
        <div class="metric-card">
            <div class="metric-value" style="color:{dp_color}">{dp:.4f}</div>
            <div class="metric-label">Demographic Parity Diff.</div>
        </div>""", unsafe_allow_html=True)

        eo_color = "#E74C3C" if abs(eo) > 0.1 else "#2ECC71"
        m3.markdown(f"""
        <div class="metric-card">
            <div class="metric-value" style="color:{eo_color}">{eo:.4f}</div>
            <div class="metric-label">Equalized Odds Diff.</div>
        </div>""", unsafe_allow_html=True)

        di_color = "#E74C3C" if di < 0.8 else "#2ECC71"
        m4.markdown(f"""
        <div class="metric-card">
            <div class="metric-value" style="color:{di_color}">{di:.4f}</div>
            <div class="metric-label">Disparate Impact</div>
        </div>""", unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)

        # ── Gauge + Radar ─────────────────────────────────────────────────────
        gauge_col, radar_col = st.columns(2)
        with gauge_col:
            st.plotly_chart(plot_fairness_gauge(score), use_container_width=True)
        with radar_col:
            st.plotly_chart(plot_metrics_comparison(metrics), use_container_width=True)

        # ── Group Distribution ────────────────────────────────────────────────
        st.markdown('<p class="section-title">Group Distribution</p>', unsafe_allow_html=True)
        st.plotly_chart(plot_group_distribution(df, protected_col, target_col), use_container_width=True)

        # ── Three Metric Charts ───────────────────────────────────────────────
        st.markdown('<p class="section-title">Bias Metric Charts</p>', unsafe_allow_html=True)
        ch1, ch2, ch3 = st.columns(3)
        with ch1:
            st.plotly_chart(
                plot_demographic_parity(metrics.get("group_positive_rates", {})),
                use_container_width=True,
            )
        with ch2:
            st.plotly_chart(
                plot_equal_opportunity(
                    metrics.get("group_positive_rates", {}),
                    metrics.get("equalized_odds_difference", 0),
                ),
                use_container_width=True,
            )
        with ch3:
            st.plotly_chart(
                plot_disparate_impact(
                    metrics.get("group_positive_rates", {}),
                    metrics.get("disparate_impact", 1),
                ),
                use_container_width=True,
            )

        # ── Group Breakdown Table ─────────────────────────────────────────────
        st.markdown('<p class="section-title">Group Breakdown</p>', unsafe_allow_html=True)
        group_rates = metrics.get("group_positive_rates", {})
        if group_rates:
            rates_list = list(group_rates.values())
            max_rate   = max(rates_list)
            breakdown_df = pd.DataFrame([
                {
                    "Group": g,
                    "Positive Rate": f"{r:.4f}",
                    "Percentage": f"{r:.1%}",
                    "DI vs. Best": f"{r/max_rate:.4f}" if max_rate > 0 else "N/A",
                    "80% Rule": "✅ Pass" if (max_rate == 0 or r / max_rate >= 0.8) else "❌ Fail",
                }
                for g, r in group_rates.items()
            ])
            st.dataframe(breakdown_df, use_container_width=True, hide_index=True)


# ── AI Insights Tab ───────────────────────────────────────────────────────────
with tab3:
    if not analyzed or metrics is None:
        st.info("👈 Run the bias analysis first.")
    else:
        target_col    = st.session_state["target_col"]
        protected_col = st.session_state["protected_col"]

        # Determine the API key to use
        sidebar_key = api_key_input if "api_key_input" in dir() else ""
        active_key  = os.environ.get("GEMINI_API_KEY", "") or sidebar_key

        if not active_key:
            st.warning(
                "⚠️ No Gemini API key provided. Enter your key in the sidebar to enable AI explanations."
            )
            st.markdown(
                "Get a free API key at → [Google AI Studio](https://aistudio.google.com/app/apikey)"
            )
        else:
            ai_results = st.session_state.get("ai_results")
            if ai_results is None:
                with st.spinner("🤖 Generating AI insights with Gemini…"):
                    ai_results = generate_explanation(
                        metrics=metrics,
                        target_col=target_col,
                        sensitive_col=protected_col,
                        dataset_info={"n_samples": len(df)},
                        api_key=active_key,
                    )
                    st.session_state["ai_results"] = ai_results

            if ai_results.get("error"):
                st.error(f"Gemini API Error: {ai_results['error']}")
            else:
                # Executive Summary
                st.markdown('<p class="section-title">📋 Executive Summary</p>', unsafe_allow_html=True)
                st.markdown(
                    f'<div class="ai-card"><h4>🔖 AI-Generated Summary</h4>{ai_results.get("report_summary", "")}</div>',
                    unsafe_allow_html=True,
                )

                # Explanation
                st.markdown('<p class="section-title">🔍 Bias Explanation</p>', unsafe_allow_html=True)
                st.markdown(
                    f'<div class="ai-card"><h4>💡 What does this mean?</h4>{ai_results.get("explanation", "")}</div>',
                    unsafe_allow_html=True,
                )

                # Recommendations
                st.markdown('<p class="section-title">🛡️ Mitigation Recommendations</p>', unsafe_allow_html=True)
                st.markdown(
                    f'<div class="ai-card"><h4>🔧 How to fix it?</h4>{ai_results.get("recommendations", "")}</div>',
                    unsafe_allow_html=True,
                )

                st.success("✅ AI insights generated by Google Gemini 1.5 Flash")


# ── Report Tab ────────────────────────────────────────────────────────────────
with tab4:
    if not analyzed or metrics is None:
        st.info("👈 Run the bias analysis first to generate a report.")
    else:
        target_col    = st.session_state["target_col"]
        protected_col = st.session_state["protected_col"]
        ai_results    = st.session_state.get("ai_results") or {}
        fname         = st.session_state.get("filename", "dataset.csv")

        st.markdown('<p class="section-title">📄 Download Bias Audit Report</p>', unsafe_allow_html=True)

        col_md, col_pdf, col_json = st.columns(3)

        # ── Markdown Report ───────────────────────────────────────────────────
        with col_md:
            md_report = generate_markdown_report(
                metrics, ai_results, target_col, protected_col, fname
            )
            st.download_button(
                label="⬇️ Download Markdown Report",
                data=md_report,
                file_name="fairai_bias_report.md",
                mime="text/markdown",
                use_container_width=True,
            )
            st.caption("Full report in Markdown format. Open with any editor or GitHub.")

        # ── PDF Report ────────────────────────────────────────────────────────
        with col_pdf:
            try:
                pdf_bytes = generate_pdf_report(
                    metrics, ai_results, target_col, protected_col, fname
                )
                st.download_button(
                    label="⬇️ Download PDF Report",
                    data=pdf_bytes,
                    file_name="fairai_bias_report.pdf",
                    mime="application/pdf",
                    use_container_width=True,
                )
                st.caption("Professional PDF audit report with metrics and AI insights.")
            except ImportError as e:
                st.warning(f"PDF generation requires fpdf2: `pip install fpdf2`")

        # ── JSON Export ───────────────────────────────────────────────────────
        with col_json:
            json_data = json.dumps(
                {"metrics": metrics, "ai_results": ai_results},
                indent=2,
                default=str,
            )
            st.download_button(
                label="⬇️ Download JSON Metrics",
                data=json_data,
                file_name="fairai_metrics.json",
                mime="application/json",
                use_container_width=True,
            )
            st.caption("Raw metrics data in JSON format for programmatic usage.")

        # ── Preview ────────────────────────────────────────────────────────────
        st.markdown('<p class="section-title">Report Preview</p>', unsafe_allow_html=True)
        with st.expander("📖 Click to preview Markdown report", expanded=False):
            st.markdown(md_report)
