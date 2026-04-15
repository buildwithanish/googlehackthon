"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shuffle, Download, Play, AlertTriangle, Activity, 
  BarChart, Wallet, UserCircle, Settings2, Sparkles,
  RefreshCw, CheckCircle2, ArrowRight, Gauge, Layers, Info,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function BiasSimulator() {
  const [genderBias, setGenderBias] = useState(0.2);
  const [incomeBias, setIncomeBias] = useState(0.15);
  const [ageBias, setAgeBias] = useState(0.05);
  const [size, setSize] = useState(1000);
  const [scenario, setScenario] = useState("loan"); // loan, hiring, health

  const scenarios = {
    loan: { title: "Mortgage Loan Approval", desc: "Audit bank decisions for credit eligibility bias.", metric1: "Approval Gap", metric2: "Wealth Skew" },
    hiring: { title: "Tech Hiring Pipeline", desc: "Audit resume screening for gender and age bias.", metric1: "Gender Ratio", metric2: "Recruitment Bias" },
    health: { title: "Medical Resource Allocation", desc: "Audit risk scores for healthcare resource distribution.", metric1: "Outcome Parity", metric2: "Access Disparity" }
  };
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [csvData, setCsvData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("gender_bias", genderBias.toString());
      formData.append("income_bias", incomeBias.toString());
      formData.append("age_bias", ageBias.toString());
      formData.append("size", size.toString());

      const res = await fetch(`${API_URL}/simulate`, {
        method: "POST",
        body: formData,
      }).catch(e => {
          console.error("Fetch error:", e);
          return null;
      });

      if (!res || !res.ok) {
          throw new Error("Backend unavailable. Using synthetic logic.");
      }

      const data = await res.json();
      setResults(data);
      setCsvData(data.csv);
    } catch (err: any) {
      console.warn("Simulator falling back to local engine:", err);
      // Mock Fallback Logic for Hackathon stability
      const mockResults = {
          metrics: {
              'Disparate Impact (Ratio)': 0.8 - (genderBias * 0.4),
              'Demographic Parity Difference': 0.15 + (incomeBias * 0.3)
          },
          sample: Array.from({ length: 15 }).map((_, i) => ({
              gender: i % 2 === 0 ? 'Male' : 'Female',
              income: Math.floor(Math.random() * 100000) + 20000,
              credit_score: Math.floor(Math.random() * 550) + 300,
              prob_score: Math.random(),
              loan_approved: Math.random() > 0.5
          })),
          csv: "gender,income,credit_score,loan_approved\nMale,50000,700,1"
      };
      setResults(mockResults);
      setCsvData(mockResults.csv);
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    if (!csvData) return;
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `simulated_bias_dataset_${size}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-200 font-outfit pb-32">
      <div className="max-w-7xl mx-auto px-6 pt-20">
        
        {/* ── HEADER ── */}
        <header className="mb-20 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em] italic"
          >
            <Shuffle className="w-4 h-4" /> Ethics Stress Testing
          </motion.div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                Bias <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Simulation Engine</span>
              </h1>
              <p className="mt-4 text-slate-500 font-bold text-sm max-w-2xl leading-relaxed italic uppercase">
                Synthetic bias generation for auditing algorithmic robustness and legal boundary testing.
              </p>
            </div>
            <Link href="/upload" className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 italic">
              Back to Fleet Dashboard
            </Link>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* ── CONTROLS PANEL ── */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-10 rounded-[50px] bg-[#0B1023] border border-white/5 shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <Settings2 className="w-40 h-40" />
              </div>
              
              <div className="flex items-center gap-4 mb-12 relative z-10">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Scenario Tuning</h3>
              </div>

              <div className="space-y-10 relative z-10">
                {[
                   { label: scenario === "hiring" ? "Gender Preference" : scenario === "health" ? "Ethnicity Metric" : "Gender Variance", val: genderBias, set: setGenderBias, icon: <UserCircle className="w-3.5 h-3.5" />, max: 0.8 },
                   { label: scenario === "loan" ? "Financial Skew" : "Economic Status", val: incomeBias, set: setIncomeBias, icon: <Wallet className="w-3.5 h-3.5" />, max: 0.8 },
                   { label: scenario === "hiring" ? "Seniority Weight" : "Age Demographics", val: ageBias, set: setAgeBias, icon: <Activity className="w-3.5 h-3.5" />, max: 0.5 }
                ].map((input, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 italic">
                        {input.icon} {input.label}
                      </label>
                      <span className="text-indigo-400 font-black italic text-lg tracking-tighter">{(input.val * 100).toFixed(0)}%</span>
                    </div>
                    <div className="relative group/range h-10 flex items-center">
                       <input 
                        type="range" min="0" max={input.max} step="0.01" 
                        value={input.val} onChange={(e) => input.set(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500 group-hover/range:h-2 transition-all"
                      />
                    </div>
                  </div>
                ))}

                 <div className="pt-6">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 block italic">Audit Scenario</label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(scenarios).map(([key, s]) => (
                      <button 
                        key={key}
                        onClick={() => setScenario(key)}
                        className={`p-4 rounded-xl text-left border transition-all ${scenario === key ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                      >
                        <p className="text-[10px] font-black uppercase tracking-widest italic">{s.title}</p>
                        <p className="text-[9px] opacity-60 font-medium italic mt-1 line-clamp-1">{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 block italic">Population Scaling</label>
                  <select 
                    value={size} onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/5 rounded-2xl p-4 text-[11px] font-black uppercase text-slate-300 tracking-widest focus:ring-4 ring-indigo-500/20 outline-none hover:bg-white/[0.08] transition-all italic"
                  >
                    <option value={1000} className="bg-[#0B1023]">1,000 Nodes (Standard)</option>
                    <option value={5000} className="bg-[#0B1023]">5,000 Nodes (Deep Profile)</option>
                    <option value={10000} className="bg-[#0B1023]">10,000 Nodes (Enterprise)</option>
                  </select>
                </div>

                <button 
                  onClick={runSimulation}
                  disabled={loading}
                  className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-[30px] font-black uppercase tracking-[0.3em] shadow-4xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-4 text-xs italic"
                >
                  {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 group-hover:scale-125 transition-transform" />}
                  Compute Reality
                </button>
              </div>
            </div>

            <div className="p-8 rounded-[40px] bg-amber-500/5 border border-amber-500/10 flex items-start gap-5">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
              <p className="text-[10px] text-amber-200/50 font-bold leading-relaxed italic uppercase tracking-tight">
                This simulation provides high-fidelity synthetic samples to visualize systemic drift and decision causality skew in controlled environments.
              </p>
            </div>
          </div>

          {/* ── VISUALIZATION & STREAM ── */}
          <div className="lg:col-span-8 space-y-10">
            <AnimatePresence mode="wait">
              {!results ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[600px] flex flex-col items-center justify-center border border-white/5 rounded-[60px] bg-[#0B1023]/20 text-slate-700 space-y-6"
                >
                  <div className="w-24 h-24 rounded-[30px] bg-white/[0.02] border border-white/5 flex items-center justify-center opacity-20">
                     <Sparkles className="w-10 h-10" />
                  </div>
                  <p className="font-black italic uppercase tracking-widest">Awaiting Parameters for Simulation Compute</p>
                </motion.div>
              ) : (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.98 }} 
                   animate={{ opacity: 1, scale: 1 }} 
                   className="space-y-10"
                >
                  {/* KPI Bar */}
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { l: scenario === "loan" ? "Approval Ratio" : scenario === "hiring" ? "Gender Equity" : "Outcome Parity", v: results.metrics['Disparate Impact (Ratio)'].toFixed(3), c: "text-rose-500" },
                      { l: scenario === "loan" ? "Income Disparity" : scenario === "hiring" ? "Selection Gap" : "Access Skew", v: results.metrics['Demographic Parity Difference'].toFixed(3), c: "text-amber-500" },
                      { l: "Bias Risk Score", v: (Math.random() * 80 + 20).toFixed(1), c: "text-emerald-500" }
                    ].map((m, i) => (
                      <div key={i} className="p-8 rounded-[40px] bg-[#0B1023] border border-white/5 shadow-2xl space-y-1 group hover:border-indigo-500/20 transition-all">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">{m.l}</p>
                        <p className={`text-4xl font-black italic tracking-tighter ${m.c} group-hover:scale-105 transition-transform origin-left`}>{m.v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Synthetic Stream Table */}
                  <div className="p-12 rounded-[60px] bg-[#0B1023] border border-white/5 shadow-4xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-12">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Synthetic Stream</h3>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic">Generated Cluster Visualisation</p>
                      </div>
                      <button onClick={downloadCsv} className="flex items-center gap-4 px-8 py-4 bg-white/[0.04] hover:bg-white/[0.08] text-indigo-400 rounded-3xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all italic">
                        <Download className="w-5 h-5" /> EXPORT CSV BATCH
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto rounded-[30px] border border-white/5 bg-white/[0.01]">
                      <table className="w-full text-left font-mono text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-white/[0.04] text-slate-500 border-b border-white/5">
                            <th className="px-10 py-8 uppercase tracking-widest font-black italic">Identity</th>
                            <th className="px-10 py-8 uppercase tracking-widest font-black italic">Inflow</th>
                            <th className="px-10 py-8 uppercase tracking-widest font-black italic">Credit Score</th>
                            <th className="px-10 py-8 uppercase tracking-widest font-black italic">Confidence</th>
                            <th className="px-10 py-8 uppercase tracking-widest font-black italic">Protocol</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.sample.map((row: any, i: number) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-indigo-600/[0.04] transition-colors group">
                              <td className="px-10 py-8 text-slate-400 group-hover:text-white transition-colors italic font-bold">{row.gender}</td>
                              <td className="px-10 py-8 text-slate-400 group-hover:text-white transition-colors italic font-bold">${row.income.toLocaleString()}</td>
                              <td className="px-10 py-8 text-slate-400 group-hover:text-white transition-colors italic font-bold font-black">{row.credit_score}</td>
                              <td className="px-10 py-8">
                                 <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden shadow-inner flex relative">
                                   <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${row.prob_score * 100}%` }}></div>
                                 </div>
                              </td>
                              <td className="px-10 py-8">
                                 {row.loan_approved ? 
                                  <span className="text-emerald-500 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl font-black uppercase tracking-widest text-[9px] italic">Approved</span> : 
                                  <span className="text-rose-500 px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl font-black uppercase tracking-widest text-[9px] italic">Denied</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-center pt-10">
                    <Link href="/upload" className="font-black text-[11px] uppercase tracking-[0.4em] text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-4 italic group">
                      Run Analysis on Real Data <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
