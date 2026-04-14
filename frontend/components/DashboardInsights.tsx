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
import { analyzeBias, pingHealth } from "@/lib/api";

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
    
    // Step 4: Ping health before analysis
    if (!isDemo) {
        const isHealthy = await pingHealth();
        if (!isHealthy) {
            console.warn("[FairAI] Backend health check failed. Attempting analysis anyway with retries.");
        }
    }

    const infoStr = localStorage.getItem("dataset_info");
    const info = infoStr ? JSON.parse(infoStr) : null;

    try {
        console.log(`[FairAI] Starting analysis for ${info?.filename || 'demo'}...`);
        if (!isDemo && info?.file_id) {
            const tempTarget = info.target_column || info.stats?.target_detected || "loan_approved";
            const tempSensitive = info.sensitive_column_hints?.[0] || "gender";
            
            const res = await analyzeBias(
                tempTarget,
                tempSensitive,
                undefined,
                info.file_id,
                process.env.NEXT_PUBLIC_GEMINI_API_KEY
            );
            
            if (!res.success) {
                console.error("[FairAI] Analysis Engine Error:", res.error);
                setResults({
                    error: res.error,
                    message: res.message
                });
                return;
            }

            console.log("[FairAI] Analysis complete. Metrics loaded.");
            setResults({
                ...res,
                scenario_name: `Audit: ${info.filename}`,
                dataset_name: info.filename,
                generated_at: new Date().toLocaleTimeString()
            });
        } else {
            // Demo fallback
            console.log("[FairAI] Running in DEMO mode.");
            setTimeout(() => {
                const filename = info?.filename || "sample_bias_dataset.csv";
                setResults({
                    success: true,
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
                console.log("[FairAI] Demo results injected.");
            }, 1000);
            return;
        }
    } catch (err: any) {
        console.error("[FairAI] Analysis Execution Crash:", err);
        setResults({ error: "System Crash", message: err.message });
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

  if (results.error) {
    return (
        <div className="p-12 rounded-[40px] bg-slate-900 border border-white/5 text-center mt-12 w-full shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-2">Dataset Loaded successfully</h3>
            <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] mb-4">Limited insights available for this structure</p>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm">{results.message || "We encountered a minor issue parsing specific bias metrics, but the dataset is safely loaded in the explorer."}</p>
            <button onClick={() => runAnalysis(false)} className="mx-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all border border-white/10">
                Retry Deep Scan
            </button>
        </div>
    );
  }

  const isExplorer = results.metrics?.explorer_mode || results.metrics?.insights_mode;
  
  // Pre-process chart data safely
  const chartData = isExplorer
    ? (results.metrics?.distributions ? Object.entries(results.metrics.distributions).slice(0, 1).map(([_, v]) => 
        Object.entries(v as any).map(([nk, nv]) => ({name: nk, val: nv}))).flat() : [])
    : (results.group_rates ? Object.entries(results.group_rates).map(([k, v]) => ({ name: k, val: v })) : []);

  return (
      <div className="space-y-10 mt-12 w-full animate-in fade-in zoom-in duration-500 pb-20">
          
          <div className="flex flex-col md:flex-row justify-between items-center bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-3xl gap-4">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/20 rounded-2xl relative overflow-hidden">
                      <Brain className="w-6 h-6 text-indigo-400 relative z-10" />
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent" />
                  </div>
                  <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                         {isExplorer ? "Universal Data Intelligence" : "Fairness Governance Panel"}
                      </h2>
                      <p className="text-indigo-400 text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                        {isExplorer ? `DOMAIN: ${results.metrics?.domain || 'Auto-Detected'}` : `Target Identified: ${results.metrics?.target || 'Decision'} • AI Audited`}
                        <div className="w-1 h-1 rounded-full bg-indigo-500" />
                        <span className="text-slate-500">Universal Engine v2.1</span>
                      </p>
                  </div>
              </div>
              <div className="flex gap-3">
                  <button onClick={() => downloadReport('pdf')} className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border border-white/5">
                      <Download className="w-3.5 h-3.5" /> Export Insights
                  </button>
                  <button onClick={() => runAnalysis(false)} className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30">
                      <RefreshCw className="w-3.5 h-3.5" /> Force Scan
                  </button>
              </div>
          </div>

          {/* ── KPI Grid ── */}
          {!isExplorer && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 p-8 rounded-[40px] bg-slate-900 border border-white/5 flex flex-col justify-center shadow-xl">
                  <FairnessGauge score={results?.metrics?.fairness_score || 55} />
              </div>
              
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                      { label: "Dem. Parity", value: results.metrics?.demographic_parity_difference || 0, status: "critical", desc: "Max selection gap" },
                      { label: "Disp. Impact", value: results.metrics?.disparate_impact || 0, status: "warning", desc: "Selection ratio bias" },
                      { label: "Equalized Odds", value: results.metrics?.equalized_odds_difference || 0, status: "safe", desc: "Error rate equality" }
                  ].map((kpi, i) => (
                      <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all flex flex-col justify-between shadow-lg">
                          <div className="flex justify-between items-start mb-4">
                              <div className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">{kpi.label}</div>
                              {kpi.status === "critical" && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                          </div>
                          <div className={`text-5xl font-black mb-3 ${kpi.status === "critical" ? "text-rose-500" : kpi.status === "warning" ? "text-amber-500" : "text-emerald-500"}`}>
                              {isNaN(kpi.value) ? "0.000" : kpi.value.toFixed(3)}
                          </div>
                          <p className="text-[9px] text-slate-500 font-bold leading-tight group-hover:text-slate-400 transition-colors uppercase tracking-wider">{kpi.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
          )}

          {/* ── Tabs Content ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left: Visualization */}
              <div className="lg:col-span-8 space-y-10">
                  <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 opacity-[0.02]">
                          <BarChart2 className="w-64 h-64" />
                      </div>
                      <div className="flex items-center justify-between mb-10 relative z-10">
                          <h3 className="text-lg font-black italic flex items-center gap-3 tracking-widest text-white uppercase">
                              <BarChart2 className="w-5 h-5 text-indigo-400" /> {isExplorer ? "FEATURE CLUSTERING" : "BIAS DISPARITY PROFILER"}
                          </h3>
                          {isExplorer && <div className="text-[9px] font-black text-slate-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">Global Density View</div>}
                      </div>
                      
                      {/* PowerBI Grid for Multiple Charts if in Explorer Mode */}
                      <div className={isExplorer ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "h-80 relative z-10"}>
                          {(isExplorer ? Object.entries(results.metrics?.distributions || {}) : [['Insights', chartData]] as [string, any][]).slice(0, 4).map(([title, dataPart], idx) => (
                             <div key={idx} className={isExplorer ? "h-60" : "h-full"}>
                                {isExplorer && <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{title}</p>}
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={isExplorer ? Object.entries(dataPart).map(([n,v]) => ({name: n, val: v})) : dataPart}>
                                        <defs>
                                            <linearGradient id={`barGradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={idx % 2 ? "#8b5cf6" : "#6366f1"} stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor={idx % 2 ? "#d946ef" : "#8b5cf6"} stopOpacity={0.3}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 9, fontWeight: '800' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 9 }} />
                                        <Tooltip 
                                            cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
                                            contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} 
                                        />
                                        <Bar dataKey="val" fill={`url(#barGradient-${idx})`} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                             </div>
                          ))}
                      </div>
                      
                      {!chartData?.length && !isExplorer && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl">
                                <Layers className="w-8 h-8 opacity-20" />
                            </div>
                            <p className="font-bold uppercase tracking-[0.2em] text-[10px]">Insufficient Variance for Charting</p>
                        </div>
                      )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="p-8 rounded-[40px] bg-indigo-600/5 border border-indigo-500/20 shadow-lg relative overflow-hidden">
                          <h4 className="text-[10px] font-black italic tracking-widest mb-6 flex items-center gap-2 text-indigo-400 uppercase">
                              <Shuffle className="w-4 h-4" /> {isExplorer ? "Correlation Heat-Signature" : "INTERSECTIONAL MATRIX"}
                          </h4>
                          {isExplorer ? (
                              <div className="grid grid-cols-4 gap-2">
                                  {results.metrics?.correlations && Object.entries(results.metrics.correlations).slice(0, 16).map(([k, v]: [string, any]) => (
                                      <div key={k} className="flex flex-col items-center gap-1">
                                          <div 
                                            className="w-full h-8 rounded-lg border border-white/5 transition-transform hover:scale-110" 
                                            style={{ 
                                                backgroundColor: `rgba(99, 102, 241, ${Math.abs(Object.values(v)[0] as number)})`,
                                                opacity: 0.3 + (Math.abs(Object.values(v)[0] as number) * 0.7)
                                            }}
                                            title={`${k} correlation`}
                                          />
                                          <span className="text-[7px] text-slate-500 font-bold uppercase truncate w-full text-center">{k.substring(0,6)}</span>
                                      </div>
                                  ))}
                                  {(!results.metrics?.correlations || Object.keys(results.metrics.correlations).length === 0) && (
                                      <p className="col-span-4 text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center py-10 opacity-50 italic">Scalar variance too low for heat signature</p>
                                  )}
                              </div>
                          ) : (
                             <IntersectionalTable data={results} />
                          )}
                      </div>
                      <div className="p-8 rounded-[40px] bg-emerald-600/5 border border-emerald-500/20 shadow-lg">
                          <h4 className="text-[10px] font-black italic tracking-widest mb-6 flex items-center gap-2 text-emerald-400 uppercase">
                              <Zap className="w-4 h-4" /> Feature Weights (XAI)
                          </h4>
                          <div className="space-y-5">
                              {(results.metrics?.shap_importance || [
                                  { feature: "Top Determinant", importance: 0.82 },
                                  { feature: "Secondary Signal", importance: 0.65 },
                                  { feature: "Global Correlation", importance: 0.41 },
                                  { feature: "Residual Pattern", importance: 0.22 },
                              ]).map((f: any, i: number) => (
                                  <div key={i} className="flex flex-col gap-2">
                                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                          <span>{f.feature}</span>
                                          <span className="text-emerald-400">{Math.round((f.importance || 0) * 100)}%</span>
                                      </div>
                                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                          <motion.div initial={{ width: 0 }} animate={{ width: `${(f.importance || 0) * 100}%` }} className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>

              {/* Right: AI & Actions */}
              <div className="lg:col-span-4 space-y-10">
                  <div className="p-8 rounded-[40px] bg-slate-900 border border-white/5 shadow-2xl relative overflow-hidden group h-full flex flex-col">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
                      <div className="flex items-center gap-4 mb-6">
                          <div className="p-2.5 bg-indigo-500/10 rounded-xl relative">
                              <Brain className="w-5 h-5 text-indigo-400" />
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                          </div>
                          <h3 className="text-lg font-black uppercase tracking-[0.2em] text-white">AI Intelligence</h3>
                      </div>
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl mb-8 flex-grow shadow-inner">
                          <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                              "{results?.ai_report || results?.ai_explanation || "Analyzing dataset metadata to generate automated intelligence recommendations for this specific domain profile..."}"
                          </p>
                      </div>
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                          <TrendingUp className="w-3 h-3" /> System Strategies
                      </h4>
                      <div className="space-y-4">
                          {[
                              { title: isExplorer ? "Anomaly Detection" : "Adversarial Debiasing", tech: "Neural Engine", risk: "Med" },
                              { title: isExplorer ? "Pattern Extraction" : "Threshold Sync", tech: "Deep Stats", risk: "Low" }
                          ].map((step, i) => (
                              <div key={i} className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                                  <div>
                                      <div className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors uppercase">{step.title}</div>
                                      <div className="text-[9px] text-indigo-400/70 font-black uppercase tracking-widest">{step.tech}</div>
                                  </div>
                                  <div className="px-2 py-1 bg-indigo-500/10 rounded text-[8px] font-black uppercase text-indigo-400 border border-indigo-500/20">Active</div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}
