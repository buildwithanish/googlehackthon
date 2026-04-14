"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, FileText, Download, Lightbulb, ShieldAlert, CheckCircle2, Copy,
  RefreshCw, Brain, TrendingDown, Scale, Zap, Printer
} from "lucide-react";
import Link from "next/link";

const DEMO_REPORT = {
  explanation: `The loan approval dataset exhibits pronounced gender-based discrimination that exceeds all acceptable fairness thresholds. Female applicants receive approval rates of 28% compared to 45% for Male applicants — a 17 percentage point gap that constitutes statistically significant disparate treatment.

Key findings:
• Demographic Parity Difference = 0.25 (threshold: 0.10) — 2.5× above limit
• Disparate Impact Ratio = 0.64 — violates the EEOC Four-Fifths (80%) Rule
• Equalized Odds Difference = 0.18 — model errors are unevenly distributed

The bias pattern suggests historical lending data has encoded structural inequality into the model's decision boundary, creating a self-perpetuating feedback loop that disadvantages female applicants.`,
  
  summary: `Executive Assessment: This model poses significant legal exposure under EEOC guidelines and carries high reputational risk. Immediate remediation is required before production deployment. The model should NOT be deployed in its current state for credit decisions affecting protected groups.`,
  
  recommendations: [
    {
      title: "Reweighing Algorithm (AIF360)",
      desc: "Apply IBM AIF360's Reweighing preprocessing to assign compensatory weights to underrepresented groups. This directly corrects statistical imbalance before model training begins.",
      impact: "High Impact",
      effort: "Low Effort",
    },
    {
      title: "Adversarial Debiasing",
      desc: "Train an auxiliary adversarial network that actively penalizes the model for encoding sensitive attribute information, enforcing demographic independence in the latent representation.",
      impact: "Very High Impact",
      effort: "Medium Effort",
    },
    {
      title: "Calibrated Equal Odds Post-Processing",
      desc: "Apply Fairlearn's ThresholdOptimizer post-training to find group-specific decision thresholds that equalize TPR/FPR across demographic groups with minimal accuracy loss.",
      impact: "High Impact",
      effort: "Low Effort",
    },
    {
      title: "Representative Data Collection",
      desc: "Conduct targeted data collection to increase approved loan samples from underrepresented groups. For every 10 majority-group samples, ensure 8+ minority-group samples (80% rule for data balance).",
      impact: "High Impact",
      effort: "High Effort",
    },
    {
      title: "Continuous Fairness Monitoring",
      desc: "Deploy a real-time fairness monitoring pipeline using FairAI's API. Set automated alerts when metrics exceed thresholds. Schedule quarterly bias audits with model retraining if DPD exceeds 0.05.",
      impact: "Critical",
      effort: "Medium Effort",
    },
  ],
  metrics: {
    fairness_score: 62,
    demographic_parity_difference: 0.25,
    equalized_odds_difference: 0.18,
    disparate_impact: 0.64,
  },
  dataset: { filename: "sample_bias_dataset.csv", rows: 500, cols: 5 },
  bias_level: "HIGH",
  generated_at: new Date().toLocaleString(),
};

function ImpactBadge({ impact }: { impact: string }) {
  const map: Record<string, string> = {
    "Critical": "bg-red-500/10 text-red-400 border-red-500/20",
    "Very High Impact": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "High Impact": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${map[impact] || "bg-white/5 text-slate-400 border-white/10"}`}>{impact}</span>;
}

export default function AIReportPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setReport(DEMO_REPORT);
      setLoading(false);
    }, 2000);
  };

  const handleCopy = () => {
    if (!report) return;
    const text = `FairAI BIAS REPORT\n\nDataset: ${report.dataset.filename}\nFairness Score: ${report.metrics.fairness_score}/100\nBias Level: ${report.bias_level}\n\nEXPLANATION:\n${report.explanation}\n\nMITIGATIONS:\n${report.recommendations.map((r: any, i: number) => `${i + 1}. ${r.title}: ${r.desc}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fairai_report.json";
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm px-4 py-1.5 rounded-full font-semibold mb-5">
              <Brain className="w-4 h-4" />
              AI Bias Report — Powered by Google Gemini
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-4xl font-black text-white">AI Bias Report</h1>
                <p className="mt-2 text-slate-400">Gemini-powered bias explanation and mitigation playbook.</p>
              </div>
              <div className="flex gap-3">
                {report && (
                  <>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Export JSON
                    </button>
                    <button
                      onClick={() => setReport(null)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600/20 border border-indigo-500/20 text-indigo-300 rounded-xl font-semibold text-sm hover:bg-indigo-600/30 transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Empty */}
        {!report && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 glass-card rounded-2xl border border-dashed border-white/10"
          >
            <div className="inline-flex p-5 bg-indigo-500/10 rounded-2xl mb-6">
              <Brain className="w-12 h-12 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Report Generated</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Generate a full AI-powered bias analysis report with explanations and mitigation recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                ← Back to Dashboard
              </Link>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20"
              >
                <Zap className="w-4 h-4" />
                Generate AI Report
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-24 glass-card rounded-2xl border border-white/5"
          >
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Brain className="absolute inset-0 m-auto w-7 h-7 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-xl font-bold text-white">Google Gemini Analyzing...</p>
            <p className="text-slate-500 mt-2">Generating bias explanation and mitigation strategies</p>
          </motion.div>
        )}

        {/* Report */}
        <AnimatePresence>
          {report && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-7">

              {/* Status banner */}
              <div className={`flex items-center gap-4 p-5 rounded-2xl border ${
                report.bias_level === "HIGH"
                  ? "bg-red-500/10 border-red-500/20"
                  : report.bias_level === "MODERATE"
                  ? "bg-orange-500/10 border-orange-500/20"
                  : "bg-emerald-500/10 border-emerald-500/20"
              }`}>
                <ShieldAlert className={`w-8 h-8 shrink-0 ${report.bias_level === "HIGH" ? "text-red-400" : report.bias_level === "MODERATE" ? "text-orange-400" : "text-emerald-400"}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-white text-lg">
                      {report.bias_level === "HIGH" ? "⚠ HIGH BIAS DETECTED" : report.bias_level === "MODERATE" ? "⚠ MODERATE BIAS" : "✓ LOW BIAS"}
                    </h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${report.bias_level === "HIGH" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"}`}>
                      Fairness Score: {report.metrics.fairness_score}/100
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Dataset: <strong className="text-slate-300">{report.dataset.filename}</strong> · {report.dataset.rows} rows · Generated: {report.generated_at}
                  </p>
                </div>
              </div>

              {/* Metrics mini cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Fairness Score", val: `${report.metrics.fairness_score}/100`, icon: <Zap className="w-4 h-4" />, color: "text-orange-400" },
                  { label: "Dem. Parity", val: report.metrics.demographic_parity_difference.toFixed(3), icon: <Scale className="w-4 h-4" />, color: "text-red-400" },
                  { label: "Disp. Impact", val: report.metrics.disparate_impact.toFixed(3), icon: <TrendingDown className="w-4 h-4" />, color: "text-red-400" },
                  { label: "Equal Odds", val: report.metrics.equalized_odds_difference.toFixed(3), icon: <Scale className="w-4 h-4" />, color: "text-orange-400" },
                ].map((m, i) => (
                  <div key={i} className="glass-card rounded-xl border border-white/5 p-4 text-center">
                    <div className={`flex justify-center mb-2 ${m.color}`}>{m.icon}</div>
                    <div className={`text-xl font-black ${m.color}`}>{m.val}</div>
                    <div className="text-slate-600 text-xs mt-1">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* AI Explanation */}
              <div className="glass-card rounded-2xl border border-indigo-500/20 p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                    <Brain className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">AI Bias Explanation</h3>
                    <p className="text-slate-500 text-sm">Generated by Google Gemini</p>
                  </div>
                </div>
                <div className="whitespace-pre-line text-slate-300 leading-relaxed p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl font-mono text-sm">
                  {report.explanation}
                </div>
              </div>

              {/* Executive Summary */}
              <div className="glass-card rounded-2xl border border-orange-500/20 p-8">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="text-orange-400 w-5 h-5" />
                  Executive Summary
                </h3>
                <p className="text-slate-300 leading-relaxed">{report.summary}</p>
              </div>

              {/* Mitigations */}
              <div className="glass-card rounded-2xl border border-white/5 p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Lightbulb className="text-emerald-400 w-5 h-5" />
                  Bias Mitigation Playbook
                  <span className="text-xs font-medium text-slate-500 ml-2">({report.recommendations.length} strategies)</span>
                </h3>
                <div className="space-y-4">
                  {report.recommendations.map((rec: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/15 text-indigo-400 font-bold text-sm flex items-center justify-center">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <h4 className="font-bold text-white">{rec.title}</h4>
                          <ImpactBadge impact={rec.impact} />
                          <span className="text-xs text-slate-500">{rec.effort}</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{rec.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Full Report (JSON)
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied to Clipboard!" : "Copy Report Text"}
                </button>
                <Link href="/dashboard" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                  ← Back to Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
