"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Activity, CheckCircle2, BarChart2, PieChart as PieChartIcon,
  TrendingUp, Brain, Download, RefreshCw, Play, ShieldAlert, ShieldCheck,
  Shuffle, Zap, Layers, Sparkles, Search, ArrowRight, Info, Filter,
  Calendar, Database, MousePointer2, Settings, MessageSquare, DownloadCloud,
  LayoutGrid, Trash2, Maximize2, Table as TableIcon, FileText, Presentation
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from "recharts";
import { useRouter } from "next/navigation";
import { analyzeBias, pingHealth } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── PowerBI Style Gauge ──────────────────────────────────────────────────────
function QualityGauge({ score, label }: { score: number, label: string }) {
  const normalized = Math.max(0, Math.min(100, score || 0));
  const dash = 440 - (440 * normalized) / 100;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full rotate-[-90deg]">
          <circle cx="80" cy="80" r="70" stroke="#1e293b" strokeWidth="12" fill="transparent" />
          <motion.circle 
            cx="80" cy="80" r="70" stroke={normalized > 80 ? "#22c55e" : normalized > 60 ? "#f59e0b" : "#ef4444"} 
            strokeWidth="12" fill="transparent" 
            strokeDasharray={440} 
            strokeDashoffset={dash} 
            strokeLinecap="round"
            initial={{ strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: dash }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black italic">{Math.round(normalized)}%</span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{label}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main BI Suite ────────────────────────────────────────────────────────────
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
                        distributions: {
                            "Status": { "Shipped": 450, "Pending": 230, "Cancelled": 120 },
                            "Trend: Transactions": { "Jan": 120, "Feb": 150, "Mar": 420, "Apr": 380, "May": 510 }
                        },
                        correlations: { "Price": { "Revenue": 0.85 }, "Quantity": { "Revenue": 0.92 } }
                    },
                    ai_report: "Strong seasonal trend detected in Q1. High correlation between Quantity and Revenue (0.92) suggests volume-driven growth."
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
            metrics: results.metrics?.explorer_mode ? results.metrics : results.metrics,
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
    <div className="py-32 flex flex-col items-center justify-center space-y-8 animate-in fade-in transition-all">
        <div className="relative">
            <div className="w-24 h-24 rounded-full border-[10px] border-indigo-500/10 border-t-indigo-500 animate-spin" />
            <div className="absolute inset-0 m-auto w-10 h-10 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
        </div>
        <div className="text-center space-y-2">
            <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">Aggregating BI Clusters</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Profiling Invariant Signals • Deep Matrix Extraction</p>
        </div>
    </div>
  );

  if (!results) return null;

  const isExplorer = results.metrics?.explorer_mode;
  const metrics = results.metrics || {};

  return (
    <div className="space-y-8 mt-12 w-full pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* ── POWERBI CONTROL CENTER ── */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6 bg-slate-900 border border-white/5 p-6 rounded-[40px] shadow-2xl sticky top-6 z-50 backdrop-blur-xl bg-opacity-80">
            <div className="flex items-center gap-5 w-full xl:w-auto">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
                    <LayoutGrid className="w-6 h-6 text-white" />
                </div>
                <div>
                   <h2 className="text-lg font-black italic flex items-center gap-2">FAIRAI <span className="text-indigo-500">BI SUITE</span></h2>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{results.dataset_name?.substring(0,25)} • Enterprise Edition</p>
                </div>
            </div>

            <div className="flex-grow max-w-2xl w-full relative group">
                <input 
                    type="text" 
                    placeholder="Ask Intelligence: 'Show income distribution' or 'Identify bias by Gender'..."
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all pr-12 placeholder:text-slate-600 italic"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && runAnalysis(false, query)}
                />
                <button 
                  onClick={() => runAnalysis(false, query)}
                  className="absolute right-3 top-3 p-2 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-lg"
                >
                    <ArrowRight className="w-4 h-4 text-white" />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <button onClick={() => runAnalysis(false)} className="px-5 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-tight text-slate-400 transition-all border border-white/5 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5" /> Re-Scan
                </button>
                <div className="h-6 w-[1px] bg-white/10 mx-1" />
                <div className="flex gap-2">
                   <button 
                     disabled={exporting}
                     onClick={() => handleExport('pdf')}
                     className="px-5 py-3 bg-white text-black hover:bg-slate-200 disabled:opacity-50 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-2"
                   >
                       <FileText className="w-3.5 h-3.5" /> PDF
                   </button>
                   <button 
                     disabled={exporting}
                     onClick={() => handleExport('ppt')}
                     className="px-5 py-3 bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-2"
                   >
                       <Presentation className="w-3.5 h-3.5" /> PPT
                   </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* ── SIDEBAR: QUALITY & INTELLIGENCE ── */}
            <div className="xl:col-span-3 space-y-8">
                <div className="p-8 rounded-[40px] bg-slate-900 border border-white/5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <ShieldCheck className="w-20 h-20" />
                    </div>
                    <QualityGauge score={metrics.quality_score} label="DATA QUALITY SCORE" />
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Duplicates</p>
                            <p className="text-lg font-black">{Number(metrics.duplicates || 0)}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Outliers</p>
                            <p className="text-lg font-black text-rose-500">
                                {Number(Object.values(metrics.outliers || {}).reduce((a: any, b: any) => a + Number(b), 0))}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-[40px] bg-indigo-600/5 border border-indigo-500/20 space-y-6 shadow-xl relative group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-widest italic text-indigo-100">AI Explainer</h4>
                    </div>
                    <p className="text-[11px] text-indigo-200/70 font-bold italic leading-relaxed">
                        "{String(results.ai_report || "The neural engine is profiling columns to detect latent patterns and decision causality. Stability is high.")}"
                    </p>
                    <div className="pt-4 flex gap-2">
                        <span className="px-2 py-1 bg-indigo-500/20 rounded text-[7px] font-black uppercase text-indigo-300">Predictive</span>
                        <span className="px-2 py-1 bg-white/5 rounded text-[7px] font-black uppercase text-slate-400">Validated</span>
                    </div>
                </div>

                <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 shadow-lg">
                    <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Dataset Metadata</h5>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-500">Domain</span>
                            <span className="text-indigo-400 truncate max-w-[120px]">{metrics.domain || "Auto-Parsed"}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-500">Engine Mode</span>
                            <span className="text-slate-300 italic">{isExplorer ? "Explorer" : "Bias Audit"}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-500">Stability</span>
                            <span className="px-2 bg-emerald-500/10 text-emerald-500 rounded">Nominal</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN DASHBOARD: CHARTS & GRIDS ── */}
            <div className="xl:col-span-9 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Records", val: metrics.total_rows || "0", icon: <Database /> },
                        { label: "Total Columns", val: Object.keys(metrics.column_types || {}).length || "0", icon: <LayoutGrid /> },
                        { label: "Missing Values", val: metrics.missing_values || "0", icon: <AlertTriangle /> },
                        { label: "Stability Index", val: "Optimal", icon: <CheckCircle2 /> }
                    ].map((card, i) => (
                        <div key={i} className="p-6 rounded-[30px] bg-slate-900 border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all shadow-xl">
                            <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
                                <p className="text-xl font-black italic">{card.val as React.ReactNode}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-indigo-500/20 flex items-center justify-center transition-all text-slate-400 group-hover:text-indigo-400">
                                {card.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* BI Dynamic Chart Grid */}
                <div className="p-10 rounded-[50px] bg-slate-900 border border-white/5 shadow-2xl relative overflow-hidden min-h-[500px]">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full" />
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div>
                            <h3 className="text-xl font-black italic uppercase italic">Enterprise Intelligence Dashboard</h3>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Automated Distribution & Trend Analysis</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><Settings className="w-4 h-4" /></button>
                            <button className="p-2 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><Maximize2 className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        {metrics.distributions && Object.entries(metrics.distributions).slice(0, 4).map(([title, dataPart]: [string, any], idx) => {
                            const isTrend = title.startsWith("Trend:");
                            const chartData = Object.entries(dataPart).map(([n,v]) => ({ name: n, val: v }));
                            
                            return (
                                <div key={idx} className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] shadow-lg group hover:bg-white/[0.04] transition-all">
                                    <div className="flex items-center justify-between mb-6">
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            {isTrend ? <Calendar className="w-3.5 h-3.5 text-indigo-400" /> : <Database className="w-3.5 h-3.5 text-indigo-400" />}
                                            {title}
                                        </h5>
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                    </div>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            {isTrend ? (
                                                <AreaChart data={chartData}>
                                                    <defs>
                                                        <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 9, fontWeight: 700 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 9 }} />
                                                    <Tooltip 
                                                        contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px', fontWeight: '800' }}
                                                        cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                                                    />
                                                    <Area type="monotone" dataKey="val" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill={`url(#grad-${idx})`} />
                                                </AreaChart>
                                            ) : (
                                                <BarChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 9, fontWeight: 700 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 9 }} />
                                                    <Tooltip 
                                                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                                        contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px', fontWeight: '800' }}
                                                    />
                                                    <Bar dataKey="val" fill="#6366f1" radius={[8, 8, 4, 4]}>
                                                        {chartData.map((_, i) => (
                                                            <Cell key={i} fillOpacity={1 - (i * 0.15)} />
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

                {/* ── RAW INTELLIGENCE MATRIX (PREVIEW) ── */}
                <div className="p-10 rounded-[50px] bg-slate-900 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black italic uppercase">Raw Intelligence Matrix</h3>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">First 50 instances • Matrix Extraction</p>
                        </div>
                        <TableIcon className="w-5 h-5 text-indigo-400 opacity-50" />
                    </div>
                    
                    <div className="overflow-x-auto rounded-[30px] border border-white/5 bg-white/[0.01]">
                        <table className="w-full text-left text-[10px] font-bold border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-slate-400 border-b border-white/5">
                                    {results.preview && results.preview.length > 0 && Object.keys(results.preview[0]).map(col => (
                                        <th key={col} className="px-6 py-4 uppercase tracking-tighter whitespace-nowrap">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {results.preview?.map((row: any, i: number) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                        {Object.values(row).map((val: any, j) => (
                                            <td key={j} className="px-6 py-4 text-slate-300 truncate max-w-[150px]">{String(val)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Heatmap Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="p-8 rounded-[40px] bg-slate-900 border border-white/5 shadow-xl">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center gap-2 italic">
                            <Shuffle className="w-4 h-4 text-indigo-400" /> Interaction Signature Matrix
                        </h4>
                        <div className="grid grid-cols-4 gap-3">
                            {metrics.correlations && Object.entries(metrics.correlations).slice(0, 16).map(([k, v]: [string, any], i) => (
                                <div key={i} className="space-y-2">
                                    <div 
                                        className="h-10 rounded-xl border border-white/5 transition-all hover:scale-105"
                                        style={{ 
                                            backgroundColor: '#6366f1',
                                            opacity: 0.1 + (Math.abs(Object.values(v)[0] as number) * 0.9)
                                        }}
                                    />
                                    <p className="text-[7px] font-black text-slate-600 uppercase text-center truncate">{k}</p>
                                </div>
                            ))}
                        </div>
                     </div>

                     <div className="p-8 rounded-[40px] bg-indigo-600/5 border border-indigo-500/20 shadow-xl flex flex-col justify-between">
                        <div>
                           <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                               <Sparkles className="w-4 h-4" /> Next-Gen Insights
                           </h4>
                           <div className="space-y-4">
                                <p className="text-xs text-indigo-100 font-bold leading-relaxed italic">
                                    "Neural scan suggests {metrics.domain?.toLowerCase()} patterns are stable. We recommend focusing on {Object.keys(metrics.outliers || {})[0] || 'variance'} stabilization for better predictions."
                                </p>
                           </div>
                        </div>
                        <div className="flex justify-between items-end mt-8">
                            <div className="space-y-1">
                                <p className="text-[7px] font-black text-indigo-400 uppercase tracking-widest">Processing Node</p>
                                <p className="text-[9px] font-black text-white uppercase italic">UA-CLUST-X9</p>
                            </div>
                            <button className="p-4 bg-indigo-600 rounded-2xl hover:bg-indigo-500 shadow-lg text-white font-black uppercase text-[9px] tracking-widest flex items-center gap-2">
                                Run Full Audit <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
}
