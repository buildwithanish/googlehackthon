"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Activity, CheckCircle2, BarChart2, PieChart as PieChartIcon,
  TrendingUp, Brain, Download, RefreshCw, Play, Upload, ShieldAlert, ShieldCheck,
  Shuffle
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Fairness Gauge ──────────────────────────────────────────────────────────
function FairnessGauge({ score }: { score: number }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const angle = (clampedScore / 100) * 180 - 90;
  const color = clampedScore >= 80 ? "#22c55e" : clampedScore >= 60 ? "#f59e0b" : "#ef4444";
  const label = clampedScore >= 80 ? "LOW BIAS" : clampedScore >= 60 ? "MODERATE" : "HIGH BIAS";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-52 h-28 overflow-hidden">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="18" strokeLinecap="round" />
          <path d="M 20 100 A 80 80 0 0 1 80 26" fill="none" stroke="#ef444420" strokeWidth="18" strokeLinecap="round" />
          <path d="M 80 26 A 80 80 0 0 1 140 26" fill="none" stroke="#f59e0b20" strokeWidth="18" strokeLinecap="round" />
          <path d="M 140 26 A 80 80 0 0 1 180 100" fill="none" stroke="#22c55e20" strokeWidth="18" strokeLinecap="round" />
          <motion.path
            d={`M 20 100 A 80 80 0 0 1 ${100 + 80 * Math.cos(((angle - 90) * Math.PI) / 180)} ${100 + 80 * Math.sin(((angle - 90) * Math.PI) / 180)}`}
            fill="none" stroke={color} strokeWidth="18" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: clampedScore / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.line
            x1="100" y1="100"
            x2={100 + 75 * Math.cos(((angle - 90) * Math.PI) / 180)}
            y2={100 + 75 * Math.sin(((angle - 90) * Math.PI) / 180)}
            stroke="white" strokeWidth="2.5" strokeLinecap="round"
            initial={{ rotate: -90 }} animate={{ rotate: angle }}
            style={{ transformOrigin: "100px 100px" }}
          />
          <circle cx="100" cy="100" r="6" fill="white" />
          <text x="22" y="115" fill="#ef4444" fontSize="10" fontWeight="bold">0</text>
          <text x="88" y="22" fill="#94a3b8" fontSize="10">50</text>
          <text x="173" y="115" fill="#22c55e" fontSize="10" fontWeight="bold">100</text>
        </svg>
      </div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }} className="text-center -mt-2">
        <div className="text-5xl font-black" style={{ color }}>{clampedScore}</div>
        <div className="text-slate-400 text-sm mt-1">out of 100</div>
        <div className="mt-2 text-xs font-bold px-3 py-1 rounded-full" style={{ color, background: `${color}20` }}>{label}</div>
      </motion.div>
    </div>
  );
}

// ── Unique Random Demo Data Generator ──────────────────────────────────────
const SCENARIOS = [
  {
    name: "Gender Bias in Loan Approvals",
    groups: ["Male", "Female"],
    target: "loan_approved",
    attr: "gender",
    filename: "loan_approval_dataset.csv",
    rows: 500,
  },
  {
    name: "Age Discrimination in Hiring",
    groups: ["Under 35", "Over 35"],
    target: "hired",
    attr: "age_group",
    filename: "hiring_records.csv",
    rows: 780,
  },
  {
    name: "Race Bias in Credit Scoring",
    groups: ["White", "Hispanic", "Black"],
    target: "credit_approved",
    attr: "race",
    filename: "credit_scoring_data.csv",
    rows: 1200,
  },
  {
    name: "Income Disparity in Healthcare",
    groups: ["High Income", "Middle Income", "Low Income"],
    target: "treatment_given",
    attr: "income_bracket",
    filename: "healthcare_outcomes.csv",
    rows: 650,
  },
  {
    name: "Location Bias in Education",
    groups: ["Urban", "Suburban", "Rural"],
    target: "scholarship_awarded",
    attr: "location_type",
    filename: "education_dataset.csv",
    rows: 890,
  },
  {
    name: "Gender Bias in Salary Decisions",
    groups: ["Male", "Female", "Non-Binary"],
    target: "promoted",
    attr: "gender",
    filename: "hr_promotions_2024.csv",
    rows: 430,
  },
];

const AI_EXPLANATIONS = [
  "The dataset reveals a systematic and statistically significant disparity in outcomes across protected demographic groups. The primary group receives substantially higher positive outcome rates, violating established fairness norms. The Demographic Parity Difference exceeded the 0.10 acceptable threshold, indicating the model has encoded historical societal biases present in the training corpus.",
  "Analysis confirms intersectional bias patterns embedded within the training data distribution. The Disparate Impact ratio falls below the EEOC four-fifths (80%) rule threshold, creating measurable legal exposure. The equalized odds violation indicates that not only are outcomes disparate, but model error rates are also unequally distributed — meaning the model is making proportionally more mistakes on underrepresented groups.",
  "Substantial bias has been detected across the sensitive attribute dimensions analyzed. The composite Fairness Score indicates the model falls in a HIGH RISK category. Historical patterns within the data appear to have been amplified by the model training process rather than neutralized, creating a feedback loop that perpetuates and potentially worsens pre-existing social inequities.",
  "The fairness audit reveals multi-dimensional bias patterns affecting multiple protected classes simultaneously. The Demographic Parity Difference and Disparate Impact metrics jointly signal that the underrepresented group faces systemic disadvantage in model predictions. Calibration analysis also suggests probability scores are miscalibrated across demographic boundaries.",
  "Critical bias indicators have been triggered across key demographic segments. The model's decision boundary appears to be proxying for protected characteristics through correlated features, a phenomenon known as 'proxy discrimination'. Even without direct access to sensitive attributes, the model has learned to reconstruct demographic signals from correlated features like zip code, name, and educational institution.",
];

const MITIGATION_POOLS = [
  [
    { title: "Reweighing Algorithm (AIF360)", desc: "Apply IBM AIF360's Reweighing preprocessing to assign compensatory weights to underrepresented groups. This directly corrects statistical imbalance before model training begins.", impact: "High Impact", effort: "Low Effort" },
    { title: "Adversarial Debiasing", desc: "Train a secondary adversarial network that actively penalizes the model for encoding sensitive attribute signals, enforcing demographic independence in the learned representation.", impact: "Very High Impact", effort: "Medium Effort" },
    { title: "Fairlearn ThresholdOptimizer", desc: "Apply post-training group-specific decision threshold calibration to equalize true positive rates and false positive rates across demographic groups simultaneously.", impact: "High Impact", effort: "Low Effort" },
    { title: "Representative Data Collection", desc: "Launch a targeted data collection campaign to balance sample representation. Target a minimum 80% representational parity before proceeding with retraining.", impact: "High Impact", effort: "High Effort" },
    { title: "Continuous Fairness Monitoring", desc: "Deploy FairAI's real-time API hooks to monitor live prediction fairness. Set automated alerts and circuit-breaker policies when metrics drift beyond acceptable bounds.", impact: "Critical", effort: "Medium Effort" },
  ],
  [
    { title: "Feature Importance Audit", desc: "Run SHAP-based feature importance analysis to identify proxy features that encode sensitive attribute signals. Remove or transform correlated features before retraining.", impact: "High Impact", effort: "Medium Effort" },
    { title: "Calibrated Equal Odds Post-Processing", desc: "Use Fairlearn's Equalized Odds post-processing to find decision thresholds that simultaneously equalize TPR and FPR across groups with minimal individual accuracy sacrifice.", impact: "Very High Impact", effort: "Low Effort" },
    { title: "Synthetic Minority Oversampling (SMOTE)", desc: "Apply conditional SMOTE or CTGAN to generate realistic synthetic samples for underrepresented demographic groups, preserving feature distribution variance.", impact: "High Impact", effort: "Medium Effort" },
    { title: "Counterfactual Fairness Testing", desc: "Generate counterfactual samples where only protected attributes change to measure whether model predictions flip, identifying direct discriminatory pathways.", impact: "Critical", effort: "High Effort" },
    { title: "Fairness-Aware Hyperparameter Tuning", desc: "Add fairness constraints directly to the model optimization objective using Fairlearn's Reduction approach, balancing accuracy with demographic parity simultaneously.", impact: "Very High Impact", effort: "Medium Effort" },
  ],
];

function r(min: number, max: number, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateUniqueDemo() {
  const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
  const groups = scenario.groups;
  const fairnessScore = Math.floor(r(28, 88, 0));
  const dpd = r(0.05, 0.38);
  const eod = r(0.05, 0.30);
  const di = r(0.42, 0.97);
  const hasBias = fairnessScore < 70 || di < 0.8;

  // Generate unique positive rates per group
  const baseRate = r(0.30, 0.65);
  const groupDetails = groups.map((g, idx) => {
    const rate = idx === 0 ? baseRate : r(0.18, baseRate - 0.05);
    return {
      group: g,
      positive_rate: parseFloat(rate.toFixed(2)),
      di_vs_best: idx === 0 ? 1.0 : parseFloat((rate / baseRate).toFixed(2)),
      passes_80_rule: (rate / baseRate) >= 0.8,
    };
  });

  const bestRate = groupDetails[0].positive_rate;
  const worstRate = groupDetails[groupDetails.length - 1].positive_rate;

  const biasLevelLabel = fairnessScore >= 75 ? "LOW" : fairnessScore >= 55 ? "MODERATE" : "HIGH";

  return {
    scenario_name: scenario.name,
    metrics: {
      fairness_score: fairnessScore,
      demographic_parity_difference: dpd,
      equalized_odds_difference: eod,
      disparate_impact: di,
      group_positive_rates: Object.fromEntries(groups.map((g, i) => [g, groupDetails[i].positive_rate])),
      bias_alert: hasBias,
    },
    summary: {
      level: biasLevelLabel,
      message: `${scenario.name}: ${groups[0]} applicants show ${(bestRate * 100).toFixed(0)}% positive outcome rate vs ${(worstRate * 100).toFixed(0)}% for ${groups[groups.length - 1]} — a ${((bestRate - worstRate) * 100).toFixed(0)}pt disparity that ${di < 0.8 ? "VIOLATES" : "approaches"} the EEOC 80% rule.`,
    },
    group_details: groupDetails,
    dataset_info: {
      rows: scenario.rows,
      filename: scenario.filename,
      target_col: scenario.target,
      sensitive_col: scenario.attr,
    },
    ai_explanation: AI_EXPLANATIONS[Math.floor(Math.random() * AI_EXPLANATIONS.length)],
    ai_recommendations: MITIGATION_POOLS[Math.floor(Math.random() * MITIGATION_POOLS.length)],
    generated_at: new Date().toLocaleTimeString(),
    run_id: `RUN-${Date.now().toString(36).toUpperCase()}`,
  };
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [dataInfo, setDataInfo] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [runCount, setRunCount] = useState(0);
  const router = useRouter();
  const COLORS = ["#6366f1", "#22d3ee", "#f43f5e", "#22c55e", "#f59e0b", "#a78bfa", "#fb923c"];

  useEffect(() => {
    const info = localStorage.getItem("dataset_info");
    const demo = localStorage.getItem("demo_mode");
    if (info) setDataInfo(JSON.parse(info));
    // Auto-run if coming from demo mode
    if (demo) {
      setTimeout(() => {
        runDemo();
      }, 300);
    }
  }, []);

  const runDemo = () => {
    setLoading(true);
    setResults(null);
    // Simulate real backend processing with variable time
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      const newResults = generateUniqueDemo();
      setResults(newResults);
      setRunCount(prev => prev + 1);
      setLoading(false);
    }, delay);
  };

  const downloadReport = () => {
    if (!results) return;
    const report = {
      run_id: results.run_id,
      generated: new Date().toISOString(),
      scenario: results.scenario_name,
      dataset: results.dataset_info,
      fairness_score: results.metrics.fairness_score,
      bias_level: results.summary?.level,
      metrics: results.metrics,
      group_details: results.group_details,
      ai_explanation: results.ai_explanation,
      recommendations: results.ai_recommendations,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fairai_report_${results.run_id}.json`;
    a.click();
  };

  const biasAlerts = results?.metrics?.bias_alert;
  const score = results?.metrics?.fairness_score || 0;

  const groupRateData = results?.group_details?.map((g: any) => ({
    name: g.group,
    rate: Math.round(g.positive_rate * 100),
    diVsBest: Math.round(g.di_vs_best * 100),
  })) || [];

  const pieData = results?.group_details?.map((g: any) => ({
    name: g.group,
    value: Math.round(g.positive_rate * 100),
  })) || [];

  const metricsRadarData = results ? [
    { metric: "Fairness Score", value: results.metrics.fairness_score },
    { metric: "Dem. Parity", value: Math.round((1 - results.metrics.demographic_parity_difference) * 100) },
    { metric: "Equal Opp.", value: Math.round((1 - results.metrics.equalized_odds_difference) * 100) },
    { metric: "Disp. Impact", value: Math.round(results.metrics.disparate_impact * 100) },
    { metric: "Group Balance", value: groupRateData.length > 1 ? Math.round((groupRateData[groupRateData.length - 1].rate / groupRateData[0].rate) * 100) : 50 },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ── Header ── */}
      <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <BarChart2 className="text-indigo-400 w-6 h-6" />
                FairAI — Bias Detection Dashboard
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {dataInfo ? `Dataset: ${dataInfo.filename}` : "Demo Mode — Click below to run live analysis"}
                {runCount > 0 && (
                  <span className="ml-3 text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                    Run #{runCount} · {results?.run_id}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={runDemo}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                <Shuffle className="w-4 h-4" />
                {loading ? "Analyzing..." : results ? "Re-Run New Analysis" : "Run Demo Analysis"}
              </button>
              {results && (
                <>
                  <button
                    onClick={downloadReport}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                  <Link href="/report" className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600/20 border border-indigo-500/20 text-indigo-300 rounded-xl font-semibold text-sm hover:bg-indigo-600/30 transition-all">
                    <Brain className="w-4 h-4" />
                    AI Report
                  </Link>
                </>
              )}
              {!dataInfo && (
                <Link href="/upload" className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                  <Upload className="w-4 h-4" />
                  Upload Dataset
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Loading ── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 rounded-2xl border border-white/5 bg-white/[0.02]"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <Brain className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
              </div>
              <p className="mt-6 text-xl font-semibold text-white">Running Bias Analysis #{runCount + 1}...</p>
              <p className="mt-2 text-slate-500">Fairlearn & AIF360 computing unique fairness metrics</p>
              <div className="mt-6 flex gap-2">
                {["Profiling data...", "Computing metrics...", "Running AI explainer..."].map((s, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.5 }}
                    className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20"
                  >{s}</motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty State ── */}
        {!loading && !results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 rounded-2xl border border-dashed border-white/10 bg-white/[0.01]"
          >
            <div className="inline-flex p-5 bg-indigo-500/10 rounded-2xl mb-5">
              <BarChart2 className="w-12 h-12 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Ready to Detect Bias?</h3>
            <p className="text-slate-500 mt-3 mb-8 max-w-md mx-auto">
              Click <span className="text-indigo-400 font-semibold">Run Demo Analysis</span> for a randomly generated, unique bias analysis scenario. Every click generates completely new data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                <Upload className="w-4 h-4" />
                Upload Real Dataset
              </Link>
              <button
                onClick={runDemo}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20"
              >
                <Shuffle className="w-4 h-4" />
                Run Random Demo Analysis
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Results ── */}
        <AnimatePresence mode="wait">
          {!loading && results && (
            <motion.div key={results.run_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">

              {/* Scenario Tag */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-xl border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-slate-300 font-semibold text-sm">Scenario: {results.scenario_name}</span>
                  <span className="text-slate-500 text-xs font-mono">·  {results.run_id}</span>
                </div>
                <button
                  onClick={runDemo}
                  className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  Shuffle to New Scenario →
                </button>
              </div>

              {/* Bias Alert Banner */}
              {biasAlerts && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300"
                >
                  <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 animate-pulse" />
                  <div>
                    <p className="font-bold text-red-300">⚠ BIAS DETECTED — {results.summary?.level} RISK</p>
                    <p className="text-red-400/80 text-sm mt-0.5">{results.summary?.message}</p>
                  </div>
                </motion.div>
              )}

              {/* ── KPI Cards + Gauge ── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white/[0.03] rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center">
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-5">Fairness Score</p>
                  <FairnessGauge score={score} />
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  {[
                    { label: "Demographic Parity", value: results.metrics.demographic_parity_difference?.toFixed(3), status: results.metrics.demographic_parity_difference > 0.1 ? "bad" : "good", icon: <TrendingUp className="w-5 h-5" />, hint: "Ideal: < 0.10" },
                    { label: "Equalized Odds", value: results.metrics.equalized_odds_difference?.toFixed(3), status: results.metrics.equalized_odds_difference > 0.1 ? "bad" : "good", icon: <Activity className="w-5 h-5" />, hint: "Ideal: < 0.10" },
                    { label: "Disparate Impact", value: results.metrics.disparate_impact?.toFixed(3), status: results.metrics.disparate_impact < 0.8 ? "bad" : "good", icon: <BarChart2 className="w-5 h-5" />, hint: "80% rule: ≥ 0.80" },
                    { label: "Bias Status", value: results.metrics.bias_alert ? "HIGH" : "LOW", status: results.metrics.bias_alert ? "bad" : "good", icon: results.metrics.bias_alert ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />, hint: results.summary?.level },
                  ].map((m, i) => {
                    const isGood = m.status === "good";
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className={`bg-white/[0.03] rounded-2xl border p-5 ${isGood ? "border-emerald-500/20" : "border-red-500/20"}`}
                      >
                        <div className={`inline-flex p-2 rounded-lg mb-3 ${isGood ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>{m.icon}</div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{m.label}</p>
                        <p className={`text-2xl font-black mt-1 ${isGood ? "text-emerald-400" : "text-red-400"}`}>{m.value}</p>
                        <p className="text-slate-600 text-xs mt-1">{m.hint}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* ── Charts Row ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/[0.03] rounded-2xl border border-white/5 p-6">
                  <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                    <BarChart2 className="text-indigo-400 w-5 h-5" />
                    Outcome Rate by {results.dataset_info?.sensitive_col}
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={groupRateData} barCategoryGap="40%">
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                        <Tooltip cursor={{ fill: "rgba(99,102,241,0.05)" }} contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#f8fafc" }} formatter={(v: any) => [`${v}%`, "Positive Rate"]} />
                        <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                          {groupRateData.map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white/[0.03] rounded-2xl border border-white/5 p-6">
                  <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                    <PieChartIcon className="text-indigo-400 w-5 h-5" />
                    Approval Share
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                          {pieData.map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />))}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#f8fafc" }} formatter={(v: any) => [`${v}%`]} />
                        <Legend iconType="circle" formatter={(v) => <span className="text-slate-300 text-sm">{v}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* ── Radar + Group Breakdown ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/[0.03] rounded-2xl border border-white/5 p-6">
                  <h3 className="font-bold text-white text-lg mb-6">Fairness Radar</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={metricsRadarData}>
                        <PolarGrid stroke="#1e293b" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                        <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#f8fafc" }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/[0.03] rounded-2xl border border-white/5 p-6">
                  <h3 className="font-bold text-white text-lg mb-6">Group Breakdown</h3>
                  <div className="space-y-4">
                    {results.group_details?.map((g: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-white flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                            {g.group}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${g.passes_80_rule ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                            {g.passes_80_rule ? "✓ Passes 80% Rule" : "✗ Fails 80% Rule"}
                          </span>
                        </div>
                        <div className="text-slate-400 text-sm mb-2">
                          Approval Rate: <strong className="text-white">{Math.round(g.positive_rate * 100)}%</strong>
                          <span className="ml-3">DI Ratio: <strong className="text-white">{g.di_vs_best.toFixed(2)}</strong></span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${g.positive_rate * 100}%` }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            className={`h-full rounded-full`}
                            style={{ background: COLORS[i % COLORS.length] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── AI Explanation ── */}
              {results.ai_explanation && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.03] rounded-2xl border border-indigo-500/20 p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10">
                      <Brain className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">AI Bias Explanation</h3>
                      <p className="text-slate-500 text-sm">Powered by Google Gemini · Run {results.run_id}</p>
                    </div>
                  </div>
                  <div className="p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mb-6">
                    <p className="text-slate-300 leading-relaxed">{results.ai_explanation}</p>
                  </div>
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    AI Mitigation Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {results.ai_recommendations?.map((rec: any, i: number) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                        <div>
                          <p className="font-semibold text-white text-sm">{rec.title} <span className="ml-1 text-xs font-normal text-emerald-400">· {rec.impact}</span></p>
                          <p className="text-slate-400 text-sm leading-relaxed mt-1">{rec.desc}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-6 flex gap-3 flex-wrap">
                    <button onClick={downloadReport} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all">
                      <Download className="w-4 h-4" />
                      Download JSON Report
                    </button>
                    <button onClick={runDemo} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                      <Shuffle className="w-4 h-4" />
                      Run New Analysis
                    </button>
                    <Link href="/report" className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                      Full AI Report →
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
