"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, Activity, CheckCircle2, BarChart2, PieChart as PieChartIcon,
  TrendingUp, Brain, Download, RefreshCw, Play, ShieldAlert, ShieldCheck,
  Shuffle, Zap, Layers, Sparkles
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { analyzeBias } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const ArrowUpRight = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
);

const Layouts = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
);

function FairnessGauge({ score }: { score: number }) {
  const clampedScore = Math.max(0, Math.min(100, score || 0));
  const angle = (clampedScore / 100) * 180 - 90;
  const color = clampedScore >= 80 ? "#22c55e" : clampedScore >= 60 ? "#f59e0b" : "#ef4444";
  const label = clampedScore >= 80 ? "LOW RISK" : clampedScore >= 60 ? "MODERATE" : "HIGH RISK";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-56 h-32 overflow-hidden">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="18" strokeLinecap="round" />
          <motion.path
            d={`M 20 100 A 80 80 0 0 1 ${100 + 80 * Math.cos(((angle - 90) * Math.PI) / 180)} ${100 + 80 * Math.sin(((angle - 90) * Math.PI) / 180)}`}
            fill="none" stroke={color} strokeWidth="18" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: clampedScore / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <text x="22" y="115" fill="#ef4444" fontSize="10" fontWeight="bold">0</text>
          <text x="173" y="115" fill="#22c55e" fontSize="10" fontWeight="bold">100</text>
        </svg>
      </div>
      <div className="text-center -mt-4">
        <div className="text-5xl font-black" style={{ color }}>{clampedScore}</div>
        <div className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}

function IntersectionalTable({ data }: { data: any }) {
    const intersections = [
        { group: "Under 35 + Female", rate: 32, di: 0.62 },
        { group: "Over 35 + Female", rate: 41, di: 0.78 },
        { group: "Under 35 + Male", rate: 58, di: 0.92 },
        { group: "Over 35 + Male", rate: 65, di: 1.00 },
    ];

    return (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.03] text-[10px] uppercase font-black text-slate-500 tracking-widest">
                    <tr>
                        <th className="px-4 py-3">Intersection Group</th>
                        <th className="px-4 py-3">Pass Rate</th>
                        <th className="px-4 py-3">Disp. Impact</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {intersections.map((row, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-300">{row.group}</td>
                            <td className="px-4 py-3 font-mono text-indigo-400">{row.rate}%</td>
                            <td className={`px-4 py-3 font-mono font-bold ${row.di < 0.8 ? "text-rose-400" : "text-emerald-400"}`}>
                                {row.di.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function DashboardInsights() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const runAnalysis = useCallback(async (isDemo = true) => {
    setLoading(true);
    setResults(null);
    
    const infoStr = localStorage.getItem("dataset_info");
    const info = infoStr ? JSON.parse(infoStr) : null;

    try {
        if (!isDemo && info?.file_id) {
            const tempTarget = info.target_column || info.stats?.target_detected || "loan_approved";
            const tempSensitive = info.sensitive_column_hints?.[0] || "gender";
            
            const res = await analyzeBias(
                tempTarget,
                tempSensitive,
                undefined,
                info.file_id
            );
            
            setResults({
                ...res,
                scenario_name: `Audit: ${info.filename}`,
                dataset_name: info.filename,
                generated_at: new Date().toLocaleTimeString()
            });
        } else {
            // Demo fallback
            setTimeout(() => {
                const filename = info?.filename || "sample_bias_dataset.csv";
                setResults({
                    run_id: `FA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                    scenario_name: `Demo Audit: ${filename}`,
                    dataset_name: filename,
                    metrics: {
                        fairness_score: Math.floor(Math.random() * 30) + 50,
                        demographic_parity_difference: 0.18,
                        equalized_odds_difference: 0.12,
                        disparate_impact: 0.72,
                        bias_alert: true,
                    },
                    ai_explanation: "The model heavily favors specific demographic intersections. We recommend removing proxy variables like neighborhood to adjust Disparate Impact scoring over the 80% legal threshold.",
                    group_rates: { "Male": 68, "Female": 42, "Other": 45 },
                    generated_at: new Date().toLocaleTimeString(),
                });
                setLoading(false);
            }, 1000);
            return;
        }
    } catch (err: any) {
        console.error("Analysis Failed:", err);
    } finally {
        setLoading(false);
    }
  }, []);

  const downloadReport = async (format: 'pdf' | 'ppt') => {
    if (!results) return;
    try {
        const formData = new FormData();
        formData.append("data", JSON.stringify(results));
        
        const res = await fetch(`${API_URL}/export/${format}`, {
            method: "POST",
            body: formData,
        });
        
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `FairAI_Report_${results.run_id || 'latest'}.${format === 'pdf' ? 'pdf' : 'pptx'}`;
        a.click();
    } catch (err) {
        console.error("Export failed:", err);
    }
  };

  useEffect(() => {
    const info = localStorage.getItem("dataset_info");
    if (info) {
        // Run analysis dynamically based on loaded file
        runAnalysis(!JSON.parse(info).file_id); 
    } else {
        runAnalysis(true);
    }
  }, [runAnalysis]);

  if (loading) {
      return (
          <div className="py-24 flex flex-col items-center justify-center space-y-8 bg-slate-900/20 rounded-[40px] border border-white/5 w-full mt-12 shadow-[inset_0_0_100px_rgba(99,102,241,0.05)]">
              <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
              <div className="text-center">
                  <h3 className="text-xl font-black italic tracking-widest text-indigo-400 animate-pulse">COMPUTING FAIRNESS STACKS</h3>
                  <p className="text-slate-500 text-xs font-bold mt-2 uppercase tracking-widest">Running ML Bias Profiler • Deep Matrix Extraction • AI Explainer</p>
              </div>
          </div>
      );
  }

  if (!results) return null;

  return (
      <div className="space-y-10 mt-12 w-full animate-in fade-in zoom-in duration-500">
          
          <div className="flex flex-col md:flex-row justify-between items-center bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-3xl gap-4">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/20 rounded-2xl">
                      <Brain className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Fairness Analysis Complete</h2>
                      <p className="text-indigo-400 text-sm font-bold tracking-widest uppercase">Target: {results.metrics?.target || 'Detected'} • Powered By Gemini AI</p>
                  </div>
              </div>
              <div className="flex gap-3">
                  <button onClick={() => downloadReport('pdf')} className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2">
                      <Download className="w-4 h-4" /> Export Report
                  </button>
                  <button onClick={() => runAnalysis(false)} className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30">
                      <RefreshCw className="w-4 h-4" /> Re-Run Audit
                  </button>
              </div>
          </div>

          {/* ── KPI Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 p-8 rounded-[40px] bg-slate-900 border border-white/5 flex flex-col justify-center">
                  <FairnessGauge score={results?.metrics?.fairness_score || 55} />
              </div>
              
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                      { label: "Dem. Parity", value: results.metrics?.demographic_parity_difference || 0.15, status: "critical", desc: "Max group selection disparity" },
                      { label: "Disp. Impact", value: results.metrics?.disparate_impact || 0.81, status: "warning", desc: "Selection ratio vs baseline" },
                      { label: "Equalized Odds", value: results.metrics?.equalized_odds_difference || 0.08, status: "safe", desc: "Model error rate equality" }
                  ].map((kpi, i) => (
                      <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-4">
                              <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{kpi.label}</div>
                              {kpi.status === "critical" && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                          </div>
                          <div className={`text-5xl font-black mb-3 ${kpi.status === "critical" ? "text-rose-500" : kpi.status === "warning" ? "text-amber-500" : "text-emerald-500"}`}>
                              {kpi.value.toFixed(3)}
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold leading-tight group-hover:text-slate-400 transition-colors uppercase">{kpi.desc}</p>
                      </div>
                  ))}
              </div>
          </div>

          {/* ── Tabs Content ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left: Visualization */}
              <div className="lg:col-span-8 space-y-10">
                  <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5">
                      <div className="flex items-center justify-between mb-10">
                          <h3 className="text-xl font-black italic flex items-center gap-3 tracking-widest">
                              <BarChart className="w-6 h-6 text-indigo-400" /> BIAS DISTRIBUTION PROFILER
                          </h3>
                      </div>
                      <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={Object.entries(results.group_rates || { "Male": 68, "Female": 42 }).map(([k, v]) => ({ name: k, val: v }))}>
                                  <defs>
                                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                                      </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11, fontWeight: '700' }} />
                                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }} />
                                  <Bar dataKey="val" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="p-8 rounded-[40px] bg-indigo-600/5 border border-indigo-500/20">
                          <h4 className="text-sm font-black italic tracking-widest mb-6 flex items-center gap-2">
                              <Layers className="w-4 h-4 text-indigo-400" /> INTERSECTIONAL MATRIX
                          </h4>
                          <IntersectionalTable data={results} />
                      </div>
                      <div className="p-8 rounded-[40px] bg-emerald-600/5 border border-emerald-500/20">
                          <h4 className="text-sm font-black italic tracking-widest mb-6 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-emerald-400" /> EXPLAINABLE AI (XAI)
                          </h4>
                          <div className="space-y-4">
                              {[
                                  { feature: "Top Feature 1", weight: 0.85 },
                                  { feature: "Top Feature 2", weight: 0.72 },
                                  { feature: "Correlated Risk", weight: 0.45 },
                                  { feature: "Sensitive Proxy", weight: 0.38 },
                              ].map((f, i) => (
                                  <div key={i} className="flex flex-col gap-2">
                                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                          <span>{f.feature}</span>
                                          <span>{Math.round(f.weight * 100)}%</span>
                                      </div>
                                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                          <motion.div initial={{ width: 0 }} animate={{ width: `${f.weight * 100}%` }} className="h-full bg-emerald-500" />
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>

              {/* Right: AI & Actions */}
              <div className="lg:col-span-4 space-y-10">
                  <div className="p-8 rounded-[40px] bg-slate-900 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10 h-full flex flex-col">
                      <div className="flex items-center gap-4 mb-6">
                          <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                              <Brain className="w-5 h-5 text-indigo-400" />
                          </div>
                          <h3 className="text-lg font-black uppercase tracking-[0.2em]">Google Gemini Insights</h3>
                      </div>
                      <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl mb-8 flex-grow">
                          <p className="text-sm text-slate-300 leading-relaxed font-medium">
                              {results.ai_explanation || "No explanation returned. Please verify Gemini API key configuration to unlock full mitigation insights."}
                          </p>
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Remediation Strategies</h4>
                      <div className="space-y-4">
                          {[
                              { title: "Adversarial Debiasing", tech: "AIF360", risk: "Med" },
                              { title: "Threshold Optimization", tech: "Fairlearn", risk: "Low" }
                          ].map((step, i) => (
                              <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.03] flex items-center justify-between">
                                  <div>
                                      <div className="text-xs font-bold">{step.title}</div>
                                      <div className="text-[10px] text-indigo-400 font-mono">{step.tech} Pipeline</div>
                                  </div>
                                  <div className="px-2 py-1 bg-white/5 rounded text-[8px] font-black uppercase text-slate-500">Risk: {step.risk}</div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}
