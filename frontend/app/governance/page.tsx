"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Legend 
} from "recharts";
import { 
  ShieldCheck, Activity, BrainCircuit, Globe, TrendingUp, AlertTriangle, 
  Fingerprint, Lock, Server, Users, Database, Zap, ArrowRight,
  Filter, Calendar, LayoutGrid, CheckCircle2, ShieldAlert, Sparkles,
  Search, Info, Heart
} from "lucide-react";

export default function EnterpriseGovernance() {
  const [activeTab, setActiveTab] = useState("Governance Platform");

  const driftData = [
    { month: "Jan", score: 92, drift: 2 },
    { month: "Feb", score: 90, drift: 5 },
    { month: "Mar", score: 85, drift: 10 },
    { month: "Apr", score: 78, drift: 18 },
    { month: "May", score: 88, drift: 7 },
    { month: "Jun", score: 94, drift: 3 },
  ];

  const models = [
    { name: "HR Resume Screening AI", version: "v4.2.1", industry: "Hiring", risk: "High", status: "Review Required", score: 68 },
    { name: "Credit Default Predictor", version: "v2.0", industry: "Finance", risk: "Medium", status: "Approved", score: 85 },
    { name: "Patient Setup Triage", version: "v1.5", industry: "Healthcare", risk: "Critical", status: "Violated", score: 45 },
    { name: "Content Recommender", version: "v8.1", industry: "Media", risk: "Low", status: "Approved", score: 94 },
  ];

  return (
    <div className="min-h-screen bg-[#070B1A] text-slate-200 font-outfit pb-32 pt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-indigo-400 font-black uppercase text-[10px] tracking-widest italic"
          >
            <Server className="w-4 h-4" /> System Control Center
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
            Enterprise <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Responsible AI Suite</span>
          </h1>
          <p className="text-slate-500 max-w-3xl font-bold text-sm tracking-tight leading-relaxed">
            Unified command center for Model Registries, Regulatory Compliance, Active Monitoring, and Explainable AI. 
            Powered by Google Gemini for autonomous auditing.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide border-b border-white/5">
          {["Governance Platform", "AI Monitoring System", "Enterprise Risk Profile", "Model Registry"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all italic border ${
                activeTab === tab 
                ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-400 shadow-lg shadow-indigo-600/10" 
                : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "Governance Platform" && (
            <motion.div 
              key="platform"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Compliance Score", value: "94/100", icon: <ShieldCheck />, color: "text-emerald-400" },
                  { label: "Active Models", value: "24", icon: <Database />, color: "text-indigo-400" },
                  { label: "Policy Violations", value: "3 Alerts", icon: <AlertTriangle />, color: "text-rose-500" },
                  { label: "Role Status", value: "Admin / Analyst", icon: <Users />, color: "text-blue-400" }
                ].map((kpi, i) => (
                  <div key={i} className="bg-[#0F172A] p-8 rounded-[40px] border border-white/5 shadow-2xl flex flex-col justify-between group hover:border-indigo-500/30 transition-all">
                    <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 text-indigo-400 group-hover:scale-110 transition-transform`}>
                      {kpi.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">{kpi.label}</p>
                      <p className={`text-3xl font-black italic tracking-tighter ${kpi.color}`}>{kpi.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0F172A] p-10 rounded-[50px] shadow-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <Lock className="w-64 h-64" />
                </div>
                <div className="flex justify-between items-center mb-10 relative z-10">
                  <h3 className="text-xl font-black italic uppercase italic flex items-center gap-3">
                    <Lock className="text-indigo-400 w-5 h-5" /> Regulatory Compliance Audit
                  </h3>
                  <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all italic">Download Data Log</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {[
                    { name: "EU AI Act Compliance Engine", status: "OK", score: "99%" },
                    { name: "Demographic Neutrality Mandate", status: "Warning", score: "82%" },
                    { name: "GDPR Explainability Tracker", status: "OK", score: "100%" },
                    { name: "NYC Hiring AI Law (Local Law 144)", status: "Failed", score: "54%" }
                  ].map((policy, i) => (
                    <div key={i} className="flex justify-between items-center p-6 border border-white/5 rounded-[30px] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                      <span className="text-xs font-black uppercase italic tracking-tight text-slate-300">{policy.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs font-black text-slate-500">{policy.score}</span>
                        <span className={`px-4 py-1 text-[9px] font-black uppercase rounded-lg border ${
                          policy.status === "OK" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                          policy.status === "Warning" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        }`}>{policy.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "AI Monitoring System" && (
            <motion.div 
              key="monitoring"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#0F172A] p-10 rounded-[50px] shadow-3xl border border-white/5">
                  <h3 className="text-xl font-black italic uppercase mb-10 flex items-center gap-3">
                    <Activity className="text-indigo-400 w-5 h-5" /> Fairness Drift Analytics
                  </h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={driftData}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorDrift" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a"/>
                        <XAxis dataKey="month" tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill: '#475569', fontSize: 10}} axisLine={false} tickLine={false} domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                        <Area type="monotone" dataKey="score" name="Stability" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                        <Area type="monotone" dataKey="drift" name="Bias Drift" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorDrift)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#0F172A] p-10 rounded-[50px] shadow-3xl border border-white/5">
                  <h3 className="text-xl font-black italic uppercase mb-10 flex items-center gap-3">
                    <BrainCircuit className="text-indigo-400 w-5 h-5" /> Neuro-Diagnostic Health
                  </h3>
                  <div className="space-y-8">
                    {[
                      { label: "Dataset Shift Anomaly", val: "8.4%", color: "bg-rose-500", w: "85%" },
                      { label: "Protected Class Imbalance", val: "MODERATE", color: "bg-amber-500", w: "60%" },
                      { label: "Cross-Group Robustness", val: "STABLE", color: "bg-emerald-500", w: "92%" }
                    ].map((diag, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-end mb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{diag.label}</span>
                          <span className="text-xs font-black text-white italic">{diag.val}</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 shadow-inner">
                          <div className={`${diag.color} h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]`} style={{width: diag.w}}></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-10 p-8 bg-rose-500/10 border border-rose-500/20 rounded-[30px] flex items-start gap-4">
                      <AlertTriangle className="text-rose-500 shrink-0 mt-1 w-6 h-6" />
                      <div className="space-y-2">
                        <strong className="text-[10px] font-black uppercase tracking-widest text-rose-500 italic block">Critical System Alert</strong>
                        <p className="text-xs text-rose-200/70 font-bold leading-relaxed">The Healthcare Model v1.5 triggered a systemic fairness degradation alarm on Age demographics. Automated debiasing protocol initiated.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Model Registry" && (
            <motion.div 
              key="registry"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#0F172A] rounded-[50px] shadow-3xl border border-white/5 overflow-hidden"
            >
              <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.01]">
                <div>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Deployed Inventory</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Autonomous Registrations Active</p>
                </div>
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 shadow-xl transition-all italic">Register New Instance</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-10 py-6 border-b border-white/5">Model / Version</th>
                      <th className="px-10 py-6 border-b border-white/5">Domain</th>
                      <th className="px-10 py-6 border-b border-white/5">Risk Class</th>
                      <th className="px-10 py-6 border-b border-white/5">Governance</th>
                      <th className="px-10 py-6 border-b border-white/5">Ethics Score</th>
                      <th className="px-10 py-6 border-b border-white/5">Telemetry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {models.map((model, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-10 py-8">
                           <p className="font-black text-white italic text-sm">{model.name}</p>
                           <p className="text-[10px] font-mono text-slate-600 tracking-tighter">{model.version}</p>
                        </td>
                        <td className="px-10 py-8 text-xs font-black uppercase italic text-slate-400">{model.industry}</td>
                        <td className="px-10 py-8">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                            model.risk === 'Critical' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                            model.risk === 'High' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            model.risk === 'Medium' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}>{model.risk}</span>
                        </td>
                        <td className="px-10 py-8 text-[10px] font-bold text-slate-500 italic uppercase">
                          {model.status === "Approved" ? <span className="text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-lg">✅ Approved Workflow </span> : <span className="text-rose-500 px-3 py-1 bg-rose-500/10 rounded-lg">❌ {model.status}</span>}
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <span className={`text-xl font-black italic ${model.score > 80 ? 'text-emerald-400' : model.score > 60 ? 'text-amber-400' : 'text-rose-400'}`}>{model.score}</span>
                            <div className="w-20 bg-white/5 rounded-full h-1.5 shadow-inner">
                              <div className={`h-full rounded-full ${model.score > 80 ? 'bg-emerald-500' : model.score > 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{width: `${model.score}%`}}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <button className="text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all italic border-b border-indigo-500/30">Trace Signals</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "Enterprise Risk Profile" && (
            <motion.div 
              key="risk"
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex justify-center items-center py-20"
            >
               <div className="bg-[#0F172A] p-16 rounded-[60px] shadow-3xl border border-white/5 text-center max-w-3xl relative overflow-hidden group">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
                  <Fingerprint className="w-24 h-24 text-indigo-400/20 mx-auto mb-10 group-hover:scale-110 transition-transform" />
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-6">Aggregate Risk Assessment</h3>
                  <p className="text-slate-500 font-bold text-sm leading-relaxed italic mb-12">This module compiles real-time explainable insights utilizing Google Gemini across your entire AI ecosystem to identify systemic clusters of bias.</p>
                  
                  <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-[40px] text-left relative z-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-3 mb-6">
                      <Sparkles className="w-4 h-4"/> Gemini Neural Intelligence Summary
                    </h4>
                    <p className="text-xs text-indigo-100 font-bold leading-relaxed italic">
                      "Based on an audit of 24 active enterprise models, there is an overarching systemic bias risk in Applicant Tracking Models (ATMs) regarding demographic parity. Recommender systems demonstrate optimal fairness metrics. Mitigation involves applying adversarial debiasing limits to the Healthcare pipeline and reinforcing bounding thresholds in HR software."
                    </p>
                  </div>
                  <button className="mt-12 px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-indigo-600/20 hover:scale-110 active:scale-95 transition-all flex items-center gap-3 mx-auto italic">
                    Generate Global Risk Audit <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
