"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shuffle, Download, Play, AlertTriangle, Activity, 
  BarChart, Wallet, UserCircle, Settings2, Sparkles,
  RefreshCw, CheckCircle2
} from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function BiasSimulator() {
  const [genderBias, setGenderBias] = useState(0.2);
  const [incomeBias, setIncomeBias] = useState(0.15);
  const [ageBias, setAgeBias] = useState(0.05);
  const [size, setSize] = useState(1000);
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [csvData, setCsvData] = useState<string | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("gender_bias", genderBias.toString());
      formData.append("income_bias", incomeBias.toString());
      formData.append("age_bias", ageBias.toString());
      formData.append("size", size.toString());

      const res = await fetch(`${API_URL}/simulate`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults(data);
      setCsvData(data.csv);
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Shuffle className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent italic">
                BIAS SIMULATOR
              </h1>
            </div>
            <p className="text-slate-400 text-sm">Synthetic bias generation engine for stress-testing fairness models</p>
          </div>
          <Link href="/dashboard" className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center gap-2">
            Back to Dashboard
          </Link>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-3xl">
              <div className="flex items-center gap-2 mb-8">
                <Settings2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold">Simulator Controls</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <UserCircle className="w-3 h-3" /> Gender Bias
                    </label>
                    <span className="text-indigo-400 font-mono font-bold">{(genderBias * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="0.5" step="0.05" 
                    value={genderBias} onChange={(e) => setGenderBias(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Wallet className="w-3 h-3" /> Income Bias
                    </label>
                    <span className="text-indigo-400 font-mono font-bold">{(incomeBias * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="0.5" step="0.05" 
                    value={incomeBias} onChange={(e) => setIncomeBias(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Activity className="w-3 h-3" /> Age Bias
                    </label>
                    <span className="text-indigo-400 font-mono font-bold">{(ageBias * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="0.3" step="0.05" 
                    value={ageBias} onChange={(e) => setAgeBias(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3 block">Dataset Scale</label>
                  <select 
                    value={size} onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full bg-slate-800 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-indigo-500"
                  >
                    <option value={1000}>1,000 Samples (Fast)</option>
                    <option value={5000}>5,000 Samples (Standard)</option>
                    <option value={10000}>10,000 Samples (Detailed)</option>
                  </select>
                </div>

                <button 
                  onClick={runSimulation}
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  Generate Reality
                </button>
              </div>
            </div>
          </div>

          {/* Visualization / Results */}
          <div className="lg:col-span-8 space-y-8">
            {!results ? (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] bg-slate-900/20 text-slate-500">
                <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold">Adjust parameters and generate bias profile</p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-6 rounded-3xl bg-slate-900 border border-white/5">
                    <div className="text-slate-500 text-[10px] font-black uppercase mb-1">Impact Ratio</div>
                    <div className="text-2xl font-black text-rose-400">{results.metrics['Disparate Impact (Ratio)'].toFixed(3)}</div>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-900 border border-white/5">
                    <div className="text-slate-500 text-[10px] font-black uppercase mb-1">Parity Diff</div>
                    <div className="text-2xl font-black text-amber-400">{results.metrics['Demographic Parity Difference'].toFixed(3)}</div>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-900 border border-white/5">
                    <button onClick={downloadCsv} className="w-full h-full flex items-center justify-center gap-2 text-indigo-400 hover:text-white transition-colors">
                      <Download className="w-5 h-5" />
                      <span className="text-xs font-black uppercase">Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Data Preview */}
                <div className="p-8 rounded-[40px] bg-slate-900/50 border border-white/5">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" /> Synthetic Data Stream
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] text-slate-500 uppercase font-black border-b border-white/5">
                          <th className="pb-4 px-2">Gender</th>
                          <th className="pb-4 px-2">Income</th>
                          <th className="pb-4 px-2">Credit</th>
                          <th className="pb-4 px-2">Approval Prob</th>
                          <th className="pb-4 px-2">Outcome</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs font-medium">
                        {results.sample.map((row: any, i: number) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-2 text-slate-300">{row.gender}</td>
                            <td className="py-3 px-2 text-slate-300">${row.income.toLocaleString()}</td>
                            <td className="py-3 px-2 text-slate-300">{row.credit_score}</td>
                            <td className="py-3 px-2">
                               <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-indigo-500" style={{ width: `${row.prob_score * 100}%` }}></div>
                               </div>
                            </td>
                            <td className="py-3 px-2">
                               {row.loan_approved ? 
                                <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-bold">Approved</span> : 
                                <span className="text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full font-bold">Denied</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
                  <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-amber-200/70 leading-relaxed font-medium">
                    This simulated environment demonstrates how algorithmic bias crystallizes when historical disparities are encoded into decision parameters.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
