"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, Activity, CheckCircle2, BarChart2, PieChart as PieChartIcon,
  TrendingUp, Brain, Download, RefreshCw, Play, Upload, ShieldAlert, ShieldCheck
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Fairness Gauge (speedometer) ──────────────────────────────────────────────
function FairnessGauge({ score }: { score: number }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const angle = (clampedScore / 100) * 180 - 90; // -90deg to +90deg

  const color =
    clampedScore >= 80 ? "#22c55e" :
    clampedScore >= 60 ? "#f59e0b" :
    "#ef4444";

  const label =
    clampedScore >= 80 ? "LOW BIAS" :
    clampedScore >= 60 ? "MODERATE" :
    "HIGH BIAS";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-52 h-28 overflow-hidden">
        {/* Background arc */}
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Arc track */}
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="18" strokeLinecap="round" />
          {/* Red zone */}
          <path d="M 20 100 A 80 80 0 0 1 80 26" fill="none" stroke="#ef444420" strokeWidth="18" strokeLinecap="round" />
          {/* Yellow zone */}
          <path d="M 80 26 A 80 80 0 0 1 140 26" fill="none" stroke="#f59e0b20" strokeWidth="18" strokeLinecap="round" />
          {/* Green zone */}
          <path d="M 140 26 A 80 80 0 0 1 180 100" fill="none" stroke="#22c55e20" strokeWidth="18" strokeLinecap="round" />
          {/* Active fill */}
          <motion.path
            d={`M 20 100 A 80 80 0 0 1 ${100 + 80 * Math.cos(((angle - 90) * Math.PI) / 180)} ${100 + 80 * Math.sin(((angle - 90) * Math.PI) / 180)}`}
            fill="none"
            stroke={color}
            strokeWidth="18"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: clampedScore / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          {/* Needle */}
          <motion.line
            x1="100" y1="100"
            x2={100 + 75 * Math.cos(((angle - 90) * Math.PI) / 180)}
            y2={100 + 75 * Math.sin(((angle - 90) * Math.PI) / 180)}
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ rotate: -90 }}
            animate={{ rotate: angle }}
            style={{ transformOrigin: "100px 100px" }}
          />
          <circle cx="100" cy="100" r="6" fill="white" />
          {/* Labels */}
          <text x="22" y="115" fill="#ef4444" fontSize="10" fontWeight="bold">0</text>
          <text x="88" y="22" fill="#94a3b8" fontSize="10">50</text>
          <text x="173" y="115" fill="#22c55e" fontSize="10" fontWeight="bold">100</text>
        </svg>
      </div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="text-center -mt-2"
      >
        <div className="text-5xl font-black" style={{ color }}>{clampedScore}</div>
        <div className="text-slate-400 text-sm mt-1">out of 100</div>
        <div className={`mt-2 text-xs font-bold px-3 py-1 rounded-full`} style={{ color, background: `${color}20` }}>
          {label}
        </div>
      </motion.div>
    </div>
  );
}

// ── Demo data generator ───────────────────────────────────────────────────────
function generateDemoResults() {
  return {
    metrics: {
      fairness_score: 62,
      demographic_parity_difference: 0.25,
      equalized_odds_difference: 0.18,
      disparate_impact: 0.64,
      group_positive_rates: { Male: 0.45, Female: 0.28 },
      bias_alert: true,
    },
    summary: {
      level: "HIGH",
      message: "Significant gender bias detected in loan approval predictions. Male applicants are approved at a 45% rate vs 28% for Female applicants, a 17 percentage point disparity that violates the EEOC 80% rule.",
    },
    group_details: [
      { group: "Male", positive_rate: 0.45, di_vs_best: 1.0, passes_80_rule: true },
      { group: "Female", positive_rate: 0.28, di_vs_best: 0.62, passes_80_rule: false },
    ],
    dataset_info: {
      rows: 500, filename: "sample_bias_dataset.csv",
      target_col: "loan_approved", sensitive_col: "gender",
    },
    ai_explanation:
      "The dataset exhibits pronounced gender-based discrimination. Female applicants face systematically lower approval rates, with a Demographic Parity Difference (DPD) of 0.25 that far exceeds the acceptable 0.1 threshold. The Disparate Impact ratio of 0.64 violates the EEOC four-fifths (80%) rule, indicating potential legal exposure. Historical lending bias appears to have been encoded into the training data.",
    ai_recommendations: [
      "Reweighing: Assign compensatory weights to under-represented groups during model training.",
      "Data Augmentation: Collect additional representative samples from disadvantaged groups.",
      "Threshold Calibration: Apply group-specific decision thresholds post-training.",
      "Adversarial Debiasing: Use adversarial learning to minimize sensitive attribute influence.",
      "Post-hoc Calibration: Apply Platt scaling or isotonic regression with fairness constraints.",
    ],
  };
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [dataInfo, setDataInfo] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const router = useRouter();
  const COLORS = ["#6366f1", "#22d3ee", "#f43f5e", "#22c55e", "#f59e0b", "#a78bfa"];

  useEffect(() => {
    const info = localStorage.getItem("dataset_info");
    const demo = localStorage.getItem("demo_mode");
    if (info) {
      setDataInfo(JSON.parse(info));
      if (demo) setIsDemoMode(true);
    }
  }, []);

  const runDemoAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      setResults(generateDemoResults());
      setLoading(false);
    }, 2000);
  };

  const downloadReport = () => {
    if (!results) return;
    const report = {
      generated: new Date().toISOString(),
      dataset: results.dataset_info?.filename,
      fairness_score: results.metrics?.fairness_score,
      bias_level: results.summary?.level,
      metrics: results.metrics,
      ai_explanation: results.ai_explanation,
      recommendations: results.ai_recommendations,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fairai_bias_report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const biasAlerts = results?.metrics?.bias_alert;
  const score = results?.metrics?.fairness_score || 0;

  // Chart data
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
    { metric: "Group Balance", value: groupRateData.length > 1 ? Math.round(groupRateData[1].rate / groupRateData[0].rate * 100) : 50 },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ── Header ── */}
      <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <BarChart2 className="text-indigo-400 w-6 h-6" />
                Bias Detection Dashboard
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {dataInfo ? `Analyzing: ${dataInfo.filename}` : "No dataset loaded"}
                {isDemoMode && (
                  <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                    Demo Mode
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {!results && (
                <button
                  onClick={runDemoAnalysis}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Play className="w-4 h-4" />
                  {loading ? "Analyzing..." : "Run Demo Analysis"}
                </button>
              )}
              {results && (
                <>
                  <button
                    onClick={downloadReport}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                  <button
                    onClick={() => setResults(null)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600/20 border border-indigo-500/20 text-indigo-300 rounded-xl font-semibold text-sm hover:bg-indigo-600/30 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                  <Link href="/report" className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 transition-all">
                    <Brain className="w-4 h-4" />
                    AI Report
                  </Link>
                </>
              )}
              {!dataInfo && (
                <Link href="/upload" className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 transition-all">
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
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 glass-card rounded-2xl border border-white/5"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Brain className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <p className="mt-6 text-xl font-semibold text-white">Running Bias Analysis...</p>
            <p className="mt-2 text-slate-500">Fairlearn & AIF360 computing fairness metrics</p>
          </motion.div>
        )}

        {/* ── Empty State ── */}
        {!loading && !results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 glass-card rounded-2xl border border-dashed border-white/10"
          >
            <BarChart2 className="w-14 h-14 text-slate-600 mx-auto mb-5" />
            <h3 className="text-xl font-bold text-white">No Analysis Yet</h3>
            <p className="text-slate-500 mt-2 mb-8 max-w-md mx-auto">
              Upload your own CSV dataset or click Run Demo Analysis to see FairAI in action instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                <Upload className="w-4 h-4" />
                Upload Dataset
              </Link>
              <button
                onClick={runDemoAnalysis}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-4 h-4" />
                Run Demo Analysis
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Results ── */}
        {!loading && results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

            {/* Bias Alert Banner */}
            {biasAlerts && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300"
              >
                <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
                <div>
                  <p className="font-bold text-red-300">⚠ High Bias Detected</p>
                  <p className="text-red-400/80 text-sm mt-0.5">{results.summary?.message}</p>
                </div>
              </motion.div>
            )}

            {/* ── KPI Cards + Gauge ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Gauge Card */}
              <div className="md:col-span-1 glass-card rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center">
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-5">Fairness Score</p>
                <FairnessGauge score={score} />
              </div>

              {/* Metrics cards */}
              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-4">
                {[
                  {
                    label: "Demographic Parity",
                    value: results.metrics.demographic_parity_difference?.toFixed(3),
                    status: results.metrics.demographic_parity_difference > 0.1 ? "bad" : "good",
                    icon: <TrendingUp className="w-5 h-5" />,
                    hint: "threshold: 0.1",
                  },
                  {
                    label: "Equalized Odds",
                    value: results.metrics.equalized_odds_difference?.toFixed(3),
                    status: results.metrics.equalized_odds_difference > 0.1 ? "bad" : "good",
                    icon: <Activity className="w-5 h-5" />,
                    hint: "threshold: 0.1",
                  },
                  {
                    label: "Disparate Impact",
                    value: results.metrics.disparate_impact?.toFixed(3),
                    status: results.metrics.disparate_impact < 0.8 ? "bad" : "good",
                    icon: <BarChart2 className="w-5 h-5" />,
                    hint: "80% rule: ≥ 0.8",
                  },
                  {
                    label: "Bias Alert",
                    value: results.metrics.bias_alert ? "HIGH" : "LOW",
                    status: results.metrics.bias_alert ? "bad" : "good",
                    icon: results.metrics.bias_alert ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />,
                    hint: results.summary?.level,
                  },
                ].map((m, i) => {
                  const isGood = m.status === "good";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`glass-card rounded-2xl border p-5 ${isGood ? "border-emerald-500/20" : "border-red-500/20"}`}
                    >
                      <div className={`inline-flex p-2 rounded-lg mb-3 ${isGood ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {m.icon}
                      </div>
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
              {/* Bar Chart */}
              <div className="lg:col-span-2 glass-card rounded-2xl border border-white/5 p-6">
                <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                  <BarChart2 className="text-indigo-400 w-5 h-5" />
                  Positive Prediction Rate by Group
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={groupRateData} barCategoryGap="40%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip
                        cursor={{ fill: "rgba(99,102,241,0.05)" }}
                        contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#f8fafc" }}
                        formatter={(v: any) => [`${v}%`, "Approval Rate"]}
                      />
                      <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                        {groupRateData.map((_: any, i: number) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="glass-card rounded-2xl border border-white/5 p-6">
                <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                  <PieChartIcon className="text-indigo-400 w-5 h-5" />
                  Group Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((_: any, i: number) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#f8fafc" }}
                        formatter={(v: any) => [`${v}%`]}
                      />
                      <Legend iconType="circle" formatter={(v) => <span className="text-slate-300 text-sm">{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ── Radar + Group Details ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl border border-white/5 p-6">
                <h3 className="font-bold text-white text-lg mb-6">Fairness Radar</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={metricsRadarData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                      <Tooltip
                        contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#f8fafc" }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Group details table */}
              <div className="glass-card rounded-2xl border border-white/5 p-6">
                <h3 className="font-bold text-white text-lg mb-6">Group Breakdown</h3>
                <div className="space-y-4">
                  {results.group_details?.map((g: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-white">{g.group}</span>
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
                          className={`h-full rounded-full ${g.passes_80_rule ? "bg-emerald-500" : "bg-red-500"}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── AI Explanation Panel ── */}
            {results.ai_explanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl border border-indigo-500/20 p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10">
                    <Brain className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">AI Bias Explanation</h3>
                    <p className="text-slate-500 text-sm">Powered by Google Gemini</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mb-6">
                  <p className="text-slate-300 leading-relaxed">{results.ai_explanation}</p>
                </div>

                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Recommended Mitigations
                </h4>
                <ul className="space-y-3">
                  {results.ai_recommendations?.map((rec: string, i: number) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-slate-300 text-sm leading-relaxed">{rec}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={downloadReport}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download JSON Report
                  </button>
                  <Link href="/report" className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                    Full AI Report
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
