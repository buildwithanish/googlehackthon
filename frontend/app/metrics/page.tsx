"use client";
import { useEffect, useState } from "react";
import { getFairnessMetrics } from "@/lib/api";
import { motion } from "framer-motion";
import { Scale, CheckCircle2, AlertTriangle, Info, BookOpen, TrendingUp, Shield, Zap } from "lucide-react";

const STATIC_METRICS = [
  {
    id: "demographic_parity_difference",
    name: "Demographic Parity Difference",
    ideal_value: 0.0,
    threshold: 0.1,
    direction: "lower_is_better",
    interpretation_label: "Max Difference in Positive Rates",
    color: "from-violet-500 to-purple-600",
    icon: <Scale className="w-6 h-6" />,
    description: "Measures the absolute difference in positive prediction rates between the best and worst performing demographic groups. An ideal system would show 0 difference.",
    interpretation: [
      { range: "0.0", label: "Perfect — equal rates across all groups", color: "text-emerald-400" },
      { range: "0.0 – 0.1", label: "Acceptable — minor variation within tolerable range", color: "text-blue-400" },
      { range: "0.1 – 0.2", label: "Concerning — noticeable disparity requiring attention", color: "text-orange-400" },
      { range: "> 0.2", label: "Critical — significant legal exposure", color: "text-red-400" },
    ],
  },
  {
    id: "equalized_odds_difference",
    name: "Equalized Odds Difference",
    ideal_value: 0.0,
    threshold: 0.1,
    direction: "lower_is_better",
    interpretation_label: "Max TPR / FPR Disparity",
    color: "from-blue-500 to-cyan-500",
    icon: <TrendingUp className="w-6 h-6" />,
    description: "Measures the maximum difference in both true positive rates (TPR) and false positive rates (FPR) across groups. Requires both error types to be equal across all demographics.",
    interpretation: [
      { range: "0.0", label: "Perfect — equal error rates across all groups", color: "text-emerald-400" },
      { range: "0.0 – 0.1", label: "Acceptable — errors are distributed fairly", color: "text-blue-400" },
      { range: "> 0.1", label: "Model errors are unevenly distributed", color: "text-red-400" },
    ],
  },
  {
    id: "disparate_impact",
    name: "Disparate Impact Ratio",
    ideal_value: 1.0,
    threshold: 0.8,
    direction: "higher_is_better",
    interpretation_label: "Ratio of Group Approval Rates",
    color: "from-emerald-500 to-teal-600",
    icon: <Shield className="w-6 h-6" />,
    description: "Ratio of positive prediction rates between the least favored and most favored groups. Values below 0.8 violate the EEOC / OFCCP Four-Fifths (80%) Rule, indicating potential legal liability.",
    interpretation: [
      { range: "1.0", label: "Perfectly equal — ideal outcome", color: "text-emerald-400" },
      { range: "0.8 – 1.0", label: "Passes 80% rule — legally acceptable", color: "text-blue-400" },
      { range: "< 0.8", label: "Fails 80% rule — legally actionable discrimination", color: "text-red-400" },
    ],
  },
  {
    id: "fairness_score",
    name: "Overall Fairness Score",
    ideal_value: 100,
    threshold: 80,
    direction: "higher_is_better",
    interpretation_label: "Composite 0–100 Fairness Score",
    color: "from-pink-500 to-rose-600",
    icon: <Zap className="w-6 h-6" />,
    description: "A composite 0–100 fairness score aggregating all three metrics above using weighted averaging. Scores of 80+ indicate a broadly fair system; below 60 requires immediate remediation.",
    interpretation: [
      { range: "80 – 100", label: "Low bias — system is broadly fair", color: "text-emerald-400" },
      { range: "60 – 79", label: "Moderate bias — review and mitigate", color: "text-orange-400" },
      { range: "< 60", label: "High bias — immediate action required", color: "text-red-400" },
    ],
  },
];

export default function MetricsPage() {
  const [metrics, setMetrics] = useState(STATIC_METRICS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getFairnessMetrics()
      .then((res) => {
        if (res.metrics?.length > 0) setMetrics(res.metrics);
      })
      .catch(() => {}) // use static fallback
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm px-4 py-1.5 rounded-full font-semibold mb-5">
              <BookOpen className="w-4 h-4" />
              Fairness Metrics Reference
            </div>
            <h1 className="text-4xl font-black text-white">Fairness Metrics Dictionary</h1>
            <p className="mt-3 text-slate-400 text-lg max-w-2xl">
              Understand the mathematical definitions and legal thresholds for AI fairness metrics used by FairAI.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {metrics.map((m: any, i: number) => {
            const colorClass = m.color || "from-indigo-500 to-purple-600";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className="group relative glass-card rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-all overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity rounded-full blur-3xl pointer-events-none`} />

                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClass} text-white shadow-lg`}>
                    {m.icon || <Scale className="w-6 h-6" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium capitalize">
                      {(m.direction || "lower_is_better").replace(/_/g, " ")}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${m.direction === "higher_is_better" ? "bg-emerald-400" : "bg-blue-400"}`} />
                  </div>
                </div>

                <h2 className={`text-2xl font-bold bg-gradient-to-r ${colorClass} bg-clip-text text-transparent`}>
                  {m.name}
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-1 mb-4">{m.interpretation_label}</p>

                <p className="text-slate-400 leading-relaxed">{m.description}</p>

                {/* Key numbers */}
                <div className="flex gap-4 mt-6 mb-6">
                  <div className="flex-1 p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                    <div className="text-xs text-slate-500 mb-1">Ideal Value</div>
                    <div className="text-emerald-400 font-black text-lg">{m.ideal_value ?? "—"}</div>
                  </div>
                  <div className="flex-1 p-3.5 rounded-xl bg-orange-500/5 border border-orange-500/10 text-center">
                    <div className="text-xs text-slate-500 mb-1">Warning Threshold</div>
                    <div className="text-orange-400 font-black text-lg">{m.threshold ?? "—"}</div>
                  </div>
                </div>

                {/* Interpretation */}
                <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" />
                    Range Interpretation
                  </h4>
                  <div className="space-y-2">
                    {(m.interpretation || []).map((interp: any, j: number) => (
                      <div key={j} className="flex items-start gap-3">
                        <code className="text-xs font-mono bg-white/5 px-2 py-0.5 rounded text-slate-400 shrink-0 mt-0.5">{interp.range}</code>
                        <span className={`text-sm ${interp.color || "text-slate-400"}`}>{interp.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Reference box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 glass-card rounded-2xl border border-indigo-500/15 p-8"
        >
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <BookOpen className="text-indigo-400 w-5 h-5" />
            Legal & Regulatory References
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            {[
              { law: "EEOC 4/5ths Rule (USA)", metric: "Disparate Impact ≥ 0.8", color: "text-blue-400" },
              { law: "EU AI Act (High Risk AI)", metric: "Continuous bias monitoring", color: "text-violet-400" },
              { law: "CFPB Fair Lending", metric: "Equal Opportunity + DPD < 0.1", color: "text-emerald-400" },
            ].map((ref, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${ref.color}`}>{ref.law}</div>
                <div className="text-slate-400">{ref.metric}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
