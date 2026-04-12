"""
dashboard/visualizations.py
Plotly-based chart generation for the FairAI dashboard.
All functions return Plotly figures ready to be rendered in Streamlit.
"""

import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np


# ── Color Palette ─────────────────────────────────────────────────────────────
PALETTE = [
    "#6C63FF", "#FF6584", "#43CBFF", "#F7971E", "#56CCF2",
    "#9B59B6", "#2ECC71", "#E74C3C", "#3498DB", "#F39C12",
]
BIAS_GREEN   = "#2ECC71"
BIAS_YELLOW  = "#F39C12"
BIAS_RED     = "#E74C3C"

BG_COLOR     = "#0E1117"
PAPER_COLOR  = "#1A1D2E"
FONT_COLOR   = "#EAEAEA"

LAYOUT_DEFAULTS = dict(
    paper_bgcolor=PAPER_COLOR,
    plot_bgcolor=BG_COLOR,
    font=dict(color=FONT_COLOR, family="Inter, sans-serif"),
    margin=dict(l=30, r=30, t=60, b=30),
)


def _fairness_color(score: float) -> str:
    if score >= 80:
        return BIAS_GREEN
    elif score >= 60:
        return BIAS_YELLOW
    return BIAS_RED


# ── Chart Functions ────────────────────────────────────────────────────────────

def plot_group_distribution(df: pd.DataFrame, sensitive_col: str, target_col: str) -> go.Figure:
    """Stacked bar chart showing group distribution by target outcome."""
    df_work = df[[sensitive_col, target_col]].dropna()
    df_work = df_work.astype({sensitive_col: str, target_col: str})

    grouped = (
        df_work.groupby([sensitive_col, target_col])
        .size()
        .reset_index(name="count")
    )

    fig = px.bar(
        grouped,
        x=sensitive_col,
        y="count",
        color=target_col,
        barmode="group",
        title=f"Group Distribution: {sensitive_col} vs {target_col}",
        color_discrete_sequence=PALETTE,
    )
    fig.update_layout(**LAYOUT_DEFAULTS)
    fig.update_xaxes(showgrid=False)
    fig.update_yaxes(gridcolor="#2A2D3E")
    return fig


def plot_demographic_parity(group_positive_rates: dict) -> go.Figure:
    """Bar chart of positive prediction rates per group (Demographic Parity view)."""
    groups = list(group_positive_rates.keys())
    rates  = list(group_positive_rates.values())

    colors = [PALETTE[i % len(PALETTE)] for i in range(len(groups))]

    fig = go.Figure(
        go.Bar(
            x=groups,
            y=rates,
            marker_color=colors,
            text=[f"{r:.1%}" for r in rates],
            textposition="outside",
        )
    )
    # Ideal parity line
    if rates:
        mean_rate = np.mean(rates)
        fig.add_hline(
            y=mean_rate,
            line_dash="dash",
            line_color="#FFFFFF",
            annotation_text=f"Mean: {mean_rate:.1%}",
            annotation_font_color="#FFFFFF",
        )

    fig.update_layout(
        title="Demographic Parity – Positive Rate per Group",
        xaxis_title=None,
        yaxis_title="Positive Prediction Rate",
        yaxis_tickformat=".0%",
        **LAYOUT_DEFAULTS,
    )
    fig.update_xaxes(showgrid=False)
    fig.update_yaxes(gridcolor="#2A2D3E")
    return fig


def plot_equal_opportunity(group_positive_rates: dict, eo_diff: float) -> go.Figure:
    """Pie chart showing group share of positive predictions."""
    groups = list(group_positive_rates.keys())
    rates  = list(group_positive_rates.values())

    fig = go.Figure(
        go.Pie(
            labels=groups,
            values=rates,
            hole=0.4,
            marker_colors=PALETTE[:len(groups)],
            textinfo="label+percent",
            insidetextorientation="radial",
        )
    )
    fig.update_layout(
        title=f"Equal Opportunity – Group Share of Positive Outcomes<br>(EOD = {eo_diff:.4f})",
        **LAYOUT_DEFAULTS,
    )
    return fig


def plot_disparate_impact(group_positive_rates: dict, disparate_impact: float) -> go.Figure:
    """Horizontal bar chart ranked by positive rate; highlights the 80% rule threshold."""
    groups = sorted(group_positive_rates.items(), key=lambda x: x[1])
    names  = [g[0] for g in groups]
    rates  = [g[1] for g in groups]

    max_rate   = max(rates) if rates else 1.0
    thresholds = [0.8 * max_rate] * len(names)

    fig = go.Figure()
    fig.add_trace(go.Bar(
        y=names, x=rates, orientation="h",
        name="Positive Rate",
        marker_color=[
            BIAS_GREEN if r >= 0.8 * max_rate else BIAS_RED
            for r in rates
        ],
        text=[f"{r:.1%}" for r in rates],
        textposition="outside",
    ))
    fig.add_trace(go.Scatter(
        y=names, x=thresholds, mode="lines",
        name="80% Rule Threshold",
        line=dict(color="#FFFFFF", dash="dot", width=2),
    ))

    fig.update_layout(
        title=f"Disparate Impact Analysis (DI = {disparate_impact:.4f})",
        xaxis_title="Positive Prediction Rate",
        yaxis_title=None,
        xaxis_tickformat=".0%",
        legend=dict(orientation="h", y=-0.15),
        **LAYOUT_DEFAULTS,
    )
    fig.update_xaxes(showgrid=False)
    fig.update_yaxes(gridcolor="#2A2D3E")
    return fig


def plot_fairness_gauge(fairness_score: float) -> go.Figure:
    """Gauge chart showing the overall fairness score (0–100)."""
    color = _fairness_color(fairness_score)

    fig = go.Figure(go.Indicator(
        mode="gauge+number+delta",
        value=fairness_score,
        delta={"reference": 80, "increasing": {"color": BIAS_GREEN}},
        gauge={
            "axis": {"range": [0, 100], "tickcolor": FONT_COLOR},
            "bar": {"color": color, "thickness": 0.25},
            "bgcolor": BG_COLOR,
            "borderwidth": 2,
            "bordercolor": FONT_COLOR,
            "steps": [
                {"range": [0, 60],  "color": "#3D1515"},
                {"range": [60, 80], "color": "#3D3015"},
                {"range": [80, 100],"color": "#153D15"},
            ],
            "threshold": {
                "line": {"color": "#FFFFFF", "width": 4},
                "thickness": 0.75,
                "value": 80,
            },
        },
        number={"suffix": "/100", "font": {"size": 40, "color": color}},
        title={"text": "Overall Fairness Score", "font": {"size": 18, "color": FONT_COLOR}},
    ))
    fig.update_layout(
        paper_bgcolor=PAPER_COLOR,
        font=dict(color=FONT_COLOR, family="Inter, sans-serif"),
        margin=dict(l=30, r=30, t=50, b=30),
        height=280,
    )
    return fig


def plot_metrics_comparison(metrics: dict) -> go.Figure:
    """Radar/spider chart comparing multiple fairness metrics."""
    dp  = min(abs(metrics.get("demographic_parity_difference", 0)) * 100, 100)
    eo  = min(abs(metrics.get("equalized_odds_difference", 0)) * 100, 100)
    di  = min(abs(1 - metrics.get("disparate_impact", 1)) * 100, 100)

    categories = ["Demographic<br>Parity Gap", "Equal Opp.<br>Gap", "Disparate<br>Impact Gap"]
    values     = [dp, eo, di]
    values_closed = values + [values[0]]
    cats_closed   = categories + [categories[0]]

    fig = go.Figure(go.Scatterpolar(
        r=values_closed,
        theta=cats_closed,
        fill="toself",
        fillcolor="rgba(108, 99, 255, 0.3)",
        line_color="#6C63FF",
        name="Bias Gap (%)",
    ))
    fig.update_layout(
        polar=dict(
            bgcolor=BG_COLOR,
            radialaxis=dict(
                visible=True,
                range=[0, 100],
                color=FONT_COLOR,
                gridcolor="#2A2D3E",
            ),
            angularaxis=dict(color=FONT_COLOR, gridcolor="#2A2D3E"),
        ),
        title="Bias Gap Radar (lower is fairer)",
        showlegend=False,
        **LAYOUT_DEFAULTS,
    )
    return fig
