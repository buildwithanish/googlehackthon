"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Scale, CheckCircle2, AlertTriangle, Info, BookOpen, 
  TrendingUp, Shield, Zap, Sparkles, Database, LayoutGrid
} from "lucide-react";

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
      { range: "0.0 – 0.1", label: "Acceptable — minor variation", color: "text-blue-400" },
      { range: "0.1 – 0.2", label: "Concerning — requires attention", color: "text-amber-500" },
      { range: "> 0.2", label: "Critical — legal exposure", color: "text-rose-500" },
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
    description: "Measures the maximum difference in both true positive rates (TPR) and false positive rates (FPR) across groups. Requires both error types to be equal.",
    interpretation: [
      { range: "0.0", label: "Perfect — equal error rates across all", color: "text-emerald-400" },
      { range: "0.0 – 0.1", label: "Acceptable — errors are fair", color: "text-blue-400" },
      { range: "> 0.1", label: "High disparity in model errors", color: "text-rose-500" },
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
    description: "Ratio of positive prediction rates. Values below 0.8 violate the EEOC Four-Fifths Rule, indicating potential legal liability.",
    interpretation: [
      { range: "1.0", label: "Perfectly equal — ideal outcome", color: "text-emerald-400" },
      { range: "0.8 – 1.0", label: "Passes 80% rule — legally acceptable", color: "text-blue-400" },
      { range: "< 0.8", label: "Fails 80% rule — actionable bias", color: "text-rose-500" },
    ],
  },
  {
    id: "fairness_score",
    name: "Overall Fairness Score",
    ideal_value: 100,
    threshold: 80,
    direction: "higher_is_better",
    interpretation_label: "Composite 0–100 Score",
    color: "from-pink-500 to-rose-600",
    icon: <Zap className="w-6 h-6" />,
    description: "A composite fairness score aggregating all metrics. Scores of 80+ indicate a broadly fair system; below 60 requires immediate remediation.",
    interpretation: [
      { range: "80 – 100", label: "Fair — low systemic bias", color: "text-emerald-400" },
      { range: "60 – 79", label: "Moderate bias — review required", color: "text-amber-500" },
      { range: "< 60", label: "High bias — remediation mandatory", color: "text-rose-500" },
    ],
  },
];

export default function MetricsPage() {
  return (
    <div className="min-h-screen bg-[#070B1A] text-slate-200 font-outfit pb-32 pt-20">
      
      {/* ── HEADER ── */}
      <section className="relative py-20 px-6 border-b border-white/5 bg-[#090D25]/40 backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <LayoutGrid className="w-64 h-64" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest italic mb-6">
              <BookOpen className="w-3.5 h-3.5" /> Reference Library
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              Fairness Metrics <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Scientific Dictionary</span>
            </h1>
            <p className="mt-4 text-slate-500 font-bold text-sm max-w-2xl leading-relaxed italic">
              Understand the mathematical definitions, legal thresholds, and algorithmic constraints 
              for AI fairness metrics used across the FairAI ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── METRICS GRID ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STATIC_METRICS.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-10 rounded-[40px] bg-[#0F172A] border border-white/5 hover:border-indigo-500/30 transition-all relative overflow-hidden flex flex-col h-full shadow-2xl"
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${m.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-full blur-3xl pointer-events-none`} />

              <div className="flex items-start justify-between mb-8">
                <div className={`p-5 rounded-2xl bg-gradient-to-br ${m.color} text-white shadow-xl group-hover:scale-110 transition-transform`}>
                  {m.icon}
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  {m.direction.replace(/_/g, " ")}
                </div>
              </div>

              <h2 className={`text-2xl font-black italic uppercase tracking-tighter bg-gradient-to-r ${m.color} bg-clip-text text-transparent mb-1`}>
                {m.name}
              </h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">{m.interpretation_label}</p>

              <p className="text-sm font-bold text-slate-400 leading-relaxed italic mb-8 flex-grow">{m.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Ideal Value</p>
                  <p className="text-xl font-black text-emerald-400 italic">{m.ideal_value ?? "—"}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Warning Threshold</p>
                  <p className="text-xl font-black text-amber-500 italic">{m.threshold ?? "—"}</p>
                </div>
              </div>

              <div className="space-y-3 p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2 italic">
                  <Info className="w-3.5 h-3.5" /> Score Interpretation
                </h4>
                {m.interpretation.map((interp, j) => (
                  <div key={j} className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500 font-mono tracking-tighter">{interp.range}</span>
                    <span className={`${interp.color} italic font-black uppercase tracking-tight`}>{interp.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LEGAL FRAMEWORK ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="p-12 rounded-[50px] bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 shadow-2xl"
        >
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-10 flex items-center gap-4">
            <Shield className="text-indigo-400 w-6 h-6" /> Regulatory & Legal Frameworks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { law: "EEOC 4/5ths Rule (USA)", metric: "Disparate Impact ≥ 0.8", color: "text-blue-400", desc: "Federal requirement for employment selection procedures." },
              { law: "EU AI Act (High Risk AI)", metric: "Continuous Bias Monitoring", color: "text-purple-400", desc: "Mandatory algorithmic transparency for critical data systems." },
              { law: "CFPB Fair Lending", metric: "Demographic Parity < 0.1", color: "text-emerald-400", desc: "Strict constraints on financial credit scoring models." },
            ].map((ref, i) => (
              <div key={i} className="p-8 rounded-[30px] bg-[#0F172A] border border-white/5 space-y-3 hover:border-indigo-500/30 transition-all group">
                <div className={`text-[10px] font-black uppercase tracking-widest ${ref.color} mb-1 italic`}>{ref.law}</div>
                <div className="text-lg font-black italic text-white leading-tight">{ref.metric}</div>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{ref.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="pt-24 pb-12 text-center">
         <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-4">Ready to Run a Forensic Audit?</p>
         <div className="flex justify-center gap-6">
            <button className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] italic border-b border-indigo-500/40 hover:text-white transition-all">Download Documentation</button>
            <span className="text-slate-800">/</span>
            <button className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] italic border-b border-indigo-500/40 hover:text-white transition-all">API Integration Guide</button>
         </div>
      </section>

    </div>
  );
}
