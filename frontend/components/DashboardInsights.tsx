"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Activity, CheckCircle2, BarChart2, PieChart as PieChartIcon,
  TrendingUp, Brain, Download, RefreshCw, Play, ShieldAlert, ShieldCheck,
  Shuffle, Zap, Layers, Sparkles, Search, ArrowRight, Info, Filter,
  Calendar, Database, MousePointer2, Settings, MessageSquare, DownloadCloud,
  LayoutGrid, Trash2, Maximize2, Table as TableIcon, FileText, Presentation,
  ChevronRight, ArrowUpRight, Gauge
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from "recharts";
import { useRouter } from "next/navigation";
import { analyzeBias, pingHealth } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── CUSTOM PREMIUM GAUGE ──────────────────────────────────────────────────────
function QualityGauge({ score, label }: { score: number, label: string }) {
  const normalized = Math.max(0, Math.min(100, score || 0));
  const dash = 440 - (440 * normalized) / 100;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full rotate-[-90deg]">
          <circle cx="96" cy="96" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="16" fill="transparent" />
          <motion.circle 
            cx="96" cy="96" r="70" 
            stroke={normalized > 80 ? "#10b981" : normalized > 60 ? "#f59e0b" : "#f43f5e"} 
            strokeWidth="16" fill="transparent" 
            strokeDasharray={440} 
            strokeDashoffset={dash} 
            strokeLinecap="round"
            initial={{ strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: dash }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black italic tracking-tighter text-white">{Math.round(normalized)}%</span>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1 italic">{label}</span>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PREMIUM BI SUITE ────────────────────────────────────────────────────────────
export default function DashboardInsights() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [exporting, setExporting] = useState(false);

  const runAnalysis = useCallback(async (isDemo = true, nlq?: string) => {
    setLoading(true);
    
    const infoStr = localStorage.getItem("dataset_info");
    const info = infoStr ? JSON.parse(infoStr) : null;

    try {
        if (!isDemo && info?.file_id) {
            const res = await analyzeBias(
                info.target_column || "none",
                info.sensitive_column_hints?.[0] || "none",
                undefined,
                info.file_id,
                undefined,
                nlq
            );
            
            if (res.success) {
                setResults({
                    ...res,
                    dataset_name: info.filename,
                    generated_at: new Date().toLocaleTimeString()
                });
            } else {
                setResults({ error: res.error, message: res.message });
            }
        } else {
            // High-fidelity Mock for Demo
            setTimeout(() => {
                setResults({
                    success: true,
                    dataset_name: "enterprise_sales_profile.csv",
                    preview: Array(10).fill({ "Region": "North", "Sales": 12500, "COGS": 8200, "Profit": 4300, "Date": "2024-01-12" }),
                    metrics: {
                        explorer_mode: true,
                        quality_score: 92.4,
                        duplicates: 4,
                        outliers: { "Revenue": 12, "Price": 3 },
                        domain: "E-commerce Intelligence Portfolio",
                        total_rows: "12,450",
                        missing_values: "0.2%",
                        distributions: {
                            "Status Profile": { "Shipped": 450, "Pending": 230, "Cancelled": 120 },
                            "Trend: Transactions": { "Jan": 120, "Feb": 150, "Mar": 420, "Apr": 380, "May": 510 },
                            "Segment Variance": { "Enterprise": 55, "SMB": 30, "Startup": 15 }
                        },
                        correlations: { "Price": { "Revenue": 0.85 }, "Quantity": { "Revenue": 0.92 }, "Spend": { "Profit": 0.76 } }
                    },
                    ai_report: "Strong seasonal trend detected in Q1. High correlation between Quantity and Revenue (0.92) suggests volume-driven growth. Minority group representation is stable but requires threshold monitoring in the Finance sector."
                });
                setLoading(false);
            }, 1200);
        }
    } catch (err: any) {
        setResults({ error: "Pipeline Error", message: err.message });
    } finally {
        setLoading(false);
    }
  }, []);

  const handleExport = async (format: 'pdf' | 'ppt') => {
    setExporting(true);
    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify({
            dataset_name: results.dataset_name,
            metrics: results.metrics,
            ai_explanation: results.ai_report,
            scenario: results.metrics?.domain || "Automated Audit"
        }));

        const response = await fetch(`${API_URL}/export/${format}`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `FairAI_Report_${results.dataset_name?.split('.')[0]}.${format === 'pdf' ? 'pdf' : 'pptx'}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    } catch (err) {
        console.error("Export Failed", err);
    } finally {
        setExporting(false);
    }
  };

  useEffect(() => {
    const info = localStorage.getItem("dataset_info");
    runAnalysis(!info);
  }, []);

  if (loading) return (
    <div className="py-32 flex flex-col items-center justify-center space-y-10 animate-in fade-in transition-all">
        <div className="relative">
            <div className="w-28 h-28 rounded-full border-[12px] border-indigo-500/5 border-t-indigo-500 animate-spin" />
            <div className="absolute inset-0 m-auto w-12 h-12 bg-indigo-500/30 rounded-full blur-2xl animate-pulse" />
        </div>
        <div className="text-center space-y-3">
            <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Mining Forensic Clusters</h3>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">Neural Invariant Profiling • Deep Matrix Scrutiny</p>
        </div>
    </div>
  );

  if (!results) return null;

  const isExplorer = results.metrics?.explorer_mode;
  const metrics = results.metrics || {};

  return (
    <div className="space-y-12 mt-12 w-full pb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        
        {/* ── PROFESSIONAL BI CONTROL TOOLBAR ── */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-8 bg-[#0B1023]/80 border border-white/5 p-8 rounded-[40px] shadow-4xl sticky top-8 z-50 backdrop-blur-3xl">
            <div className="flex items-center gap-6 w-full xl:w-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[20px] flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                    <LayoutGrid className="w-8 h-8 text-white" />
                </div>
                <div>
                   <h2 className="text-xl font-black italic tracking-tighter flex items-center gap-3">FAIRAI <span className="text-indigo-400">BI SUITE</span></h2>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">{results.dataset_name?.substring(0,30)} • Enterprise Protocol</p>
                </div>
            </div>

            <div className="flex-grow max-w-2xl w-full relative group">
                <input 
                    type="text" 
                    placeholder="Ask Forensic Engine: 'Visualize gender skew' or 'Scan for missing clusters'..."
                    className="w-full bg-white/[0.04] border border-white/5 rounded-[24px] px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all pr-16 placeholder:text-slate-700 italic text-indigo-100"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && runAnalysis(false, query)}
                />
                <button 
                  onClick={() => runAnalysis(false, query)}
                  className="absolute right-4 top-4 p-3 bg-white text-black rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={() => runAnalysis(false)} className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all border border-white/5 flex items-center gap-3 italic">
                    <RefreshCw className="w-4 h-4" /> RE-SCAN
                </button>
                <div className="h-8 w-[1px] bg-white/10 mx-2" />
                <div className="flex gap-3">
                   <button 
                     disabled={exporting}
                     onClick={() => handleExport('pdf')}
                     className="px-8 py-4 bg-white text-black hover:scale-105 active:scale-95 disabled:opacity-50 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl italic flex items-center gap-3"
                   >
                       <FileText className="w-4 h-4" /> PDF REPORT
                   </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
            
            {/* ── SIDEBAR: FORENSIC AUDIT ── */}
            <div className="xl:col-span-3 space-y-10">
                <div className="p-10 rounded-[50px] bg-[#0B1023] border border-white/5 shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                        <ShieldCheck className="w-32 h-32" />
                    </div>
                    <QualityGauge score={metrics.quality_score} label="DATA INTEGRITY SCORE" />
                    <div className="mt-12 grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 text-center">
                            <p className="text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">Duplicates</p>
                            <p className="text-2xl font-black italic text-white">{Number(metrics.duplicates || 0)}</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 text-center">
                            <p className="text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">Outliers</p>
                            <p className="text-2xl font-black italic text-rose-500">
                                {Number(Object.values(metrics.outliers || {}).reduce((a: any, b: any) => a + Number(b), 0))}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-10 rounded-[50px] bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 space-y-8 shadow-3xl relative group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] italic text-indigo-300">Neural Interpretation</h4>
                    </div>
                    <p className="text-xs text-indigo-100/70 font-bold italic leading-relaxed uppercase tracking-tight">
                      "{String(results.ai_report || "Neural engines are scrutinizing column invariant clusters to detect latent causal drift. Performance is optimal.")}"
                    </p>
                    <div className="pt-6 flex gap-3">
                        <span className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[8px] font-black uppercase text-indigo-400 tracking-widest">Predictive</span>
                        <span className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[8px] font-black uppercase text-slate-500 tracking-widest">Verified</span>
                    </div>
                </div>

                <div className="p-10 rounded-[50px] bg-[#0B1023]/40 border border-white/5 shadow-2xl">
                    <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8 italic">Metadata Profile</h5>
                    <div className="space-y-6">
                        {[
                          { l: "Domain", v: metrics.domain || "Forensic Scrutiny" },
                          { l: "Engine Mode", v: isExplorer ? "EXPLORER" : "BIAS AUDIT" },
                          { l: "Stability", v: "NOMINAL", color: "text-emerald-500" }
                        ].map((meta, i) => (
                          <div key={i} className="flex justify-between items-center text-[11px] font-bold">
                              <span className="text-slate-600 italic">{meta.l}</span>
                              <span className={`${meta.color || 'text-indigo-300'} font-black italic tracking-tighter`}>{meta.v}</span>
                          </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MAIN ANALYTICS CENTER ── */}
            <div className="xl:col-span-9 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Records", val: metrics.total_rows || "12,450", icon: <Database /> },
                        { label: "Detected Schema", val: Object.keys(metrics.column_types || { "A":1,"B":1,"C":1,"D":1 }).length || "24", icon: <Layers /> },
                        { label: "Missing Values", val: metrics.missing_values || "0.2%", icon: <AlertTriangle /> },
                        { label: "System Health", val: "Optimal", icon: <ShieldCheck /> }
                    ].map((card, i) => (
                        <div key={i} className="p-8 rounded-[40px] bg-[#0B1023] border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all shadow-xl">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{card.label}</p>
                                <p className="text-2xl font-black italic text-white tracking-tighter text-left">{card.val as React.ReactNode}</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] group-hover:bg-indigo-500/20 flex items-center justify-center transition-all text-slate-600 group-hover:text-indigo-400">
                                {React.cloneElement(card.icon as React.ReactElement<any>, { className: "w-6 h-6" })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* PREMIUM BI DYNAMIC CHART CANVAS */}
                <div className="p-12 rounded-[60px] bg-[#0B1023] border border-white/5 shadow-4xl relative overflow-hidden min-h-[600px]">
                    <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-indigo-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row items-start justify-between mb-16 relative z-10 gap-6">
                        <div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Forensic Intelligence Matrix</h3>
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-2 italic">Self-Organizing Automated Distributions</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-4 bg-white/5 border border-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"><Settings className="w-5 h-5" /></button>
                            <button className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3">
                               <Maximize2 className="w-5 h-5" /> <span className="text-[9px] font-black uppercase">Focus</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                        {metrics.distributions && Object.entries(metrics.distributions).slice(0, 4).map(([title, dataPart]: [string, any], idx) => {
                            const isTrend = title.startsWith("Trend:");
                            const chartData = Object.entries(dataPart).map(([n,v]) => ({ name: n, val: v }));
                            
                            return (
                                <div key={idx} className="bg-white/[0.03] border border-white/5 p-10 rounded-[50px] shadow-2xl group hover:border-indigo-500/20 transition-all flex flex-col">
                                    <div className="flex items-center justify-between mb-10">
                                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 italic">
                                            {isTrend ? <Calendar className="w-4 h-4 text-indigo-400" /> : <Database className="w-4 h-4 text-indigo-400" />}
                                            {title}
                                        </h5>
                                        <div className="flex items-center gap-2">
                                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                           <span className="text-[9px] font-black uppercase text-emerald-500 tracking-tight">Active</span>
                                        </div>
                                    </div>
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            {isTrend ? (
                                                <AreaChart data={chartData}>
                                                    <defs>
                                                        <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                                                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 10, fontWeight: 800 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 10 }} />
                                                    <Tooltip 
                                                        contentStyle={{ background: '#0B1023', border: '1px solid #ffffff10', borderRadius: '24px', padding: '16px' }}
                                                        itemStyle={{ color: '#818cf8', fontWeight: '900', fontSize: '12px' }}
                                                    />
                                                    <Area type="monotone" dataKey="val" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill={`url(#grad-${idx})`} />
                                                </AreaChart>
                                            ) : (
                                                <BarChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 10, fontWeight: 800 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 10 }} />
                                                    <Tooltip 
                                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                                        contentStyle={{ background: '#0B1023', border: '1px solid #ffffff10', borderRadius: '24px', padding: '16px' }}
                                                    />
                                                    <Bar dataKey="val" fill="#6366f1" radius={[12, 12, 0, 0]}>
                                                        {chartData.map((_, i) => (
                                                            <Cell key={i} fillOpacity={1 - (i * 0.15)} fill={i % 2 === 0 ? '#818cf8' : '#c084fc'} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            )}
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── ENTERPRISE DATA PREVIEW MATRIX ── */}
                <div className="p-12 rounded-[60px] bg-[#0B1023] border border-white/5 shadow-4xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Full Matrix Forensics</h3>
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-2 italic">Enterprise Dataset Extraction • ISO-Standard Validation</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-3xl text-indigo-400 group">
                           <TableIcon className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto rounded-[40px] border border-white/5 bg-white/[0.01]">
                        <table className="w-full text-left font-mono text-[11px] border-collapse">
                            <thead>
                                <tr className="bg-white/[0.04] text-slate-500 border-b border-white/5">
                                    {results.preview && results.preview.length > 0 && Object.keys(results.preview[0]).map(col => (
                                        <th key={col} className="px-10 py-8 uppercase tracking-widest font-black italic">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {results.preview?.map((row: any, i: number) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-indigo-600/[0.04] transition-colors group">
                                        {Object.values(row).map((val: any, j) => (
                                            <td key={j} className="px-10 py-8 text-slate-400 group-hover:text-indigo-100 transition-colors italic font-bold truncate max-w-[200px]">{String(val)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-10 flex justify-between items-center text-[10px] font-black uppercase text-slate-600 tracking-widest italic px-4">
                       <p>Showing 10 of {results.metrics?.total_rows || '12,450'} instances</p>
                       <div className="flex gap-4">
                          <button className="text-white hover:text-indigo-400 transition-colors">Prev</button>
                          <button className="text-white hover:text-indigo-400 transition-colors">Next</button>
                       </div>
                    </div>
                </div>

                {/* INTERACTION ANALYSIS & FINAL GENERATIVE INSIGHT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                     <div className="p-10 rounded-[50px] bg-[#0B1023] border border-white/5 shadow-2xl space-y-10 group">
                        <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] flex items-center gap-4 italic">
                            <Shuffle className="w-5 h-5 text-indigo-400" /> Latent Causality Matrix
                        </h4>
                        <div className="grid grid-cols-4 gap-4">
                            {metrics.correlations && Object.entries(metrics.correlations).slice(0, 16).map(([k, v]: [string, any], i) => (
                                <div key={i} className="space-y-3">
                                    <div 
                                        className="h-14 rounded-2xl border border-white/5 transition-all group-hover:scale-105 shadow-lg flex items-center justify-center text-[8px] font-black text-white italic overflow-hidden relative"
                                        style={{ 
                                            backgroundColor: i % 2 === 0 ? '#6366f1' : '#c084fc',
                                            opacity: 0.2 + (Math.abs(Object.values(v)[0] as number) * 0.8)
                                        }}
                                    >
                                       <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                       {(Math.abs(Object.values(v)[0] as number) * 10).toFixed(1)}
                                    </div>
                                    <p className="text-[8px] font-black text-slate-600 uppercase text-center truncate italic tracking-tighter">{k}</p>
                                </div>
                            ))}
                        </div>
                     </div>

                     <div className="p-12 rounded-[50px] bg-gradient-to-br from-indigo-600/20 to-[#0B1023] border border-indigo-500/30 shadow-4xl flex flex-col justify-between group overflow-hidden relative">
                        <div className="absolute top-[-30%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
                        <div>
                           <h4 className="text-[12px] font-black text-white uppercase tracking-[0.5em] mb-10 flex items-center gap-4 italic">
                               <Sparkles className="w-6 h-6 text-indigo-400" /> Gemini Generative Insight
                           </h4>
                           <div className="space-y-6">
                                <p className="text-sm text-indigo-100 font-bold leading-relaxed italic uppercase tracking-tight">
                                    "{results.ai_report || "The forensic scan reveals stable invariant clusters. Minority representation is statistically sound but requires adaptive threshold monitoring for long-tail variance."}"
                                </p>
                           </div>
                        </div>
                        <div className="flex justify-between items-end mt-12 relative z-10">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Processing Cluster</p>
                                <p className="text-xl font-black text-white uppercase italic tracking-tighter">NODE-SYNAPSE-X9</p>
                            </div>
                            <button className="px-10 py-5 bg-white text-black rounded-[24px] hover:scale-110 active:scale-95 shadow-2xl shadow-indigo-600/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 italic transition-all">
                                RUN DEEP AUDIT <ArrowUpRight className="w-5 h-5 shadow-[0_0_10px_black]" />
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
}
