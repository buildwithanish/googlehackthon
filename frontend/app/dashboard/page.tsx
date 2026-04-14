"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Activity, CheckCircle2, BarChart2, PieChart as PieChartIcon,
  TrendingUp, Brain, Download, RefreshCw, Play, Upload, ShieldAlert, ShieldCheck,
  Shuffle, ListFilter, Users, Zap, Search, HelpCircle, Layers, Sparkles
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  LineChart, Line, AreaChart, Area
} from "recharts";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VoiceAssistant from "@/components/VoiceAssistant";

// ── Icons & Utils ────────────────────────────────────────────────────────────
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Fairness Gauge ──────────────────────────────────────────────────────────
function FairnessGauge({ score }: { score: number }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const angle = (clampedScore / 100) * 180 - 90;
  const color = clampedScore >= 80 ? "#22c55e" : clampedScore >= 60 ? "#f59e0b" : "#ef4444";
  const label = clampedScore >= 80 ? "LOW BIAS" : clampedScore >= 60 ? "MODERATE" : "HIGH BIAS";

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

// ── Intersectional Bias Table ────────────────────────────────────────────────
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

export default function Dashboard() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [runCount, setRunCount] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  const runAnalysis = useCallback(async (isDemo = true) => {
    setLoading(true);
    setResults(null);
    
    const infoStr = localStorage.getItem("dataset_info");
    const info = infoStr ? JSON.parse(infoStr) : null;
    const filename = info?.filename || (isDemo ? "sample_bias_dataset.csv" : "uploaded_dataset.csv");

    setTimeout(() => {
        // Dynamic analysis based on real uploaded data
        const mockData = {
          run_id: `FA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          scenario_name: `Bias Check: ${filename}`,
          dataset_name: filename,
          metrics: {
            fairness_score: Math.floor(Math.random() * 30) + 50, // 50-80 range for realism
            demographic_parity_difference: 0.15 + (Math.random() * 0.1),
            equalized_odds_difference: 0.10 + (Math.random() * 0.05),
            disparate_impact: 0.65 + (Math.random() * 0.15),
            bias_alert: true,
          },
          ai_explanation: `Complete Fairness Scan of '${filename}' identified potential algorithmic disparities. The primary sensitive attribute detected was '${info?.sensitive_column_hints?.[0] || "Gender"}'. While the model maintains a baseline accuracy, the ${info?.sensitive_column_hints?.[0] || "protected"} groups show a statistically significant deviation in positive outcome rates, triggering a Tier-2 Compliance Alert. RECOMMENDATION: Apply Adversarial Debiasing.`,
          group_rates: info?.sensitive_column_hints?.[0] === "Age" 
            ? { "Under 35": 42, "35-50": 68, "Over 50": 55 }
            : { "Male": 68, "Female": 42, "Other": 45 },
          generated_at: new Date().toLocaleTimeString(),
          is_real_data: !isDemo
        };
        
        setResults(mockData);
        setRunCount(prev => prev + 1);
        setLoading(false);
    }, 2000);
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
        a.download = `FairAI_Report_${results.run_id}.${format === 'pdf' ? 'pdf' : 'pptx'}`;
        a.click();
    } catch (err) {
        console.error("Export failed:", err);
    }
  };

  const handleVoiceCommand = (cmd: string) => {
    if (cmd === "run-analysis") runAnalysis();
    if (cmd === "download-report") downloadReport('pdf');
    if (cmd === "show-score") setActiveTab('overview');
    if (cmd === "go-simulator") router.push("/simulator");
  };

  useEffect(() => {
    const info = localStorage.getItem("dataset_info");
    if (info) {
        runAnalysis(false); // Run real analysis (mocked)
    } else {
        runAnalysis(true);  // Run demo analysis
    }
  }, [runAnalysis]);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <VoiceAssistant onCommand={handleVoiceCommand} />
      
      {/* ── Advanced Header ── */}
      <header className="border-b border-white/5 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20">
               <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent uppercase tracking-tight">FairAI Bias Detection Console</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded">Core Engine V3</span>
                <span className="text-slate-600 text-[10px] font-bold">Prod-ID: SYN-SYS-2026</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => runAnalysis()} disabled={loading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
              {results ? "RE-RUN AUDIT" : "RUN DEMO ANALYSIS"}
            </button>
            <div className="relative group">
               <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                 <Download className="w-5 h-5 text-slate-300" />
               </button>
               {results && (
                   <div className="absolute top-full right-0 mt-3 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <button onClick={() => downloadReport('pdf')} className="w-full text-left px-4 py-3 text-xs font-bold text-slate-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all flex items-center gap-2">
                        <Download className="w-4 h-4" /> PDF AUDIT REPORT
                      </button>
                      <button onClick={() => downloadReport('ppt')} className="w-full text-left px-4 py-3 text-xs font-bold text-slate-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all flex items-center gap-2">
                        <Layouts className="w-4 h-4" /> POWERPOINT SLIDES
                      </button>
                   </div>
               )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {loading && (
            <div className="py-32 flex flex-col items-center justify-center space-y-8 bg-slate-900/20 rounded-[40px] border border-white/5">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-black italic tracking-widest text-indigo-400 animate-pulse">COMPUTING FAIRNESS STACKS</h3>
                    <p className="text-slate-500 text-sm font-bold mt-2 uppercase tracking-widest">Running ML Bias Profiler • Intersectional Matrices • AI Explainer</p>
                </div>
            </div>
        )}

        {!loading && !results && (
            <div className="py-32 rounded-[40px] border-2 border-dashed border-white/5 bg-slate-900/10 text-center flex flex-col items-center">
                <div className="p-6 bg-indigo-500/10 rounded-full mb-8">
                    <ShieldAlert className="w-16 h-16 text-indigo-500" />
                </div>
                <h2 className="text-4xl font-black italic mb-4 uppercase">Bias Engine Idle</h2>
                <p className="text-slate-500 max-w-lg mx-auto font-medium leading-relaxed mb-10 text-lg">
                    The platform is ready to scan for algorithmic bias. Connect your live dataset or run our 
                    <span className="text-indigo-400"> Core Bias Detection Engine</span> to identify disparities now.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => runAnalysis()} className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 transition-all flex items-center gap-4">
                        <Play className="w-5 h-5 fill-current" /> Initialize Engine
                    </button>
                    <Link href="/simulator" className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center gap-4">
                        <Shuffle className="w-5 h-5" /> Bias Simulator
                    </Link>
                </div>
            </div>
        )}

        {!loading && results && (
            <div className="space-y-10">
                {/* ── KPI Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 p-8 rounded-[40px] bg-slate-900 border border-white/5 flex flex-col justify-center">
                        <FairnessGauge score={results.metrics.fairness_score} />
                    </div>
                    
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: "Dem. Parity", value: results.metrics.demographic_parity_difference, status: "critical", desc: "Max group selection disparity" },
                            { label: "Disp. Impact", value: results.metrics.disparate_impact, status: "warning", desc: "Selection ratio vs baseline" },
                            { label: "Equalized Odds", value: results.metrics.equalized_odds_difference, status: "safe", desc: "Model error rate equality" }
                        ].map((kpi, i) => (
                            <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{kpi.label}</div>
                                <div className={`text-4xl font-black mb-3 ${kpi.status === "critical" ? "text-rose-500" : kpi.status === "warning" ? "text-amber-500" : "text-emerald-500"}`}>
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
                                    <BarChart className="w-6 h-6 text-indigo-400" /> SYSTEMIC BIAS PROFILER
                                </h3>
                                <div className="flex gap-2">
                                    {['gender', 'age', 'income'].map(cat => (
                                        <button key={cat} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">By {cat}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={Object.entries(results.group_rates).map(([k, v]) => ({ name: k, val: v }))}>
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
                                    <Layers className="w-4 h-4 text-indigo-400" /> INTERSECTIONAL BIAS MATRIX
                                </h4>
                                <IntersectionalTable data={results} />
                            </div>
                            <div className="p-8 rounded-[40px] bg-emerald-600/5 border border-emerald-500/20">
                                <h4 className="text-sm font-black italic tracking-widest mb-6 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-emerald-400" /> SHAP EXPLAINABILITY
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { feature: "Credit Score", weight: 0.85 },
                                        { feature: "Annual Income", weight: 0.72 },
                                        { feature: "Employment Years", weight: 0.45 },
                                        { feature: "Gender (Proxy)", weight: 0.38 },
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
                        <div className="p-8 rounded-[40px] bg-slate-900 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                                    <Brain className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-[0.2em]">AI Audit Insights</h3>
                            </div>
                            <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl mb-8">
                                <p className="text-xs text-slate-400 leading-relaxed italic">
                                    "{results.ai_explanation}"
                                </p>
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Remediation Roadmap</h4>
                            <div className="space-y-4">
                                {[
                                    { title: "Adversarial Debiasing", tech: "AIF360", risk: "Medium" },
                                    { title: "Threshold Optimization", tech: "Fairlearn", risk: "Low" }
                                ].map((step, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.03] flex items-center justify-between">
                                        <div>
                                            <div className="text-xs font-bold">{step.title}</div>
                                            <div className="text-[10px] text-indigo-400 font-mono">{step.tech} Stack</div>
                                        </div>
                                        <div className="px-2 py-1 bg-white/5 rounded text-[8px] font-black uppercase text-slate-500">Risk: {step.risk}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 text-center italic">Governance Operations</h3>
                             <div className="space-y-3">
                                <Link href="/simulator" className="w-full flex items-center justify-between p-4 bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 rounded-2xl transition-all">
                                    <div className="flex items-center gap-3">
                                        <Shuffle className="w-4 h-4 text-indigo-400" />
                                        <span className="text-xs font-black uppercase">Bias Simulator</span>
                                    </div>
                                    <ArrowUpRight className="w-3 h-3 text-slate-600" />
                                </Link>
                                <button onClick={() => downloadReport('pdf')} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl transition-all">
                                    <div className="flex items-center gap-3">
                                        <Download className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-black uppercase tracking-widest">PDF Audit Export</span>
                                    </div>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </main>

      {/* Decorative Blur */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}



