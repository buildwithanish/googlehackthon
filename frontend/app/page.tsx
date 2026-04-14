"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Brain, Database, Zap, ArrowRight, ShieldCheck, BarChart3, 
  FileText, Cpu, Search, Filter, Layers, Users, Globe, 
  ShieldAlert, Sparkles, LayoutGrid, CheckCircle, Activity,
  Upload, FileQuestion, TrendingUp, PieChart, Info, Mail,
  Github, Twitter, Linkedin
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { useDropzone } from 'react-dropzone';

// Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Mock Data for Dashboard Preview
const barData = [
  { name: 'Age', bias: 0.12 },
  { name: 'Gender', bias: 0.45 },
  { name: 'Income', bias: 0.28 },
  { name: 'Race', bias: 0.15 },
  { name: 'Location', bias: 0.05 },
];

const pieData = [
  { name: 'Fair', value: 75 },
  { name: 'Biased', value: 25 },
];

const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b'];

export default function LandingPage() {
  const [uploadedFile, setUploadedFile] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFile({
        name: acceptedFiles[0].name,
        rows: "12,450",
        cols: "24",
        score: "85/100"
      });
    },
    accept: { 'text/csv': ['.csv'] },
    multiple: false
  });

  return (
    <div className="flex flex-col w-full bg-[#070B1A] text-slate-200 overflow-x-hidden pt-10">
      
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest text-indigo-400"
          >
            <Sparkles className="w-3.5 h-3.5" /> Google Solution Challenge 2026
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-white"
          >
            FairAI <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Bias Detection Platform</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Detect, explain, and eliminate bias in AI systems using fairness metrics and Google AI. 
            The professional standard for algorithmic governance.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link href="/upload" className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
              Upload Dataset
            </Link>
            <Link href="/upload" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold transition-all hover:bg-white/10 hover:scale-105 active:scale-95">
              Run Demo Analysis
            </Link>
          </motion.div>

          {/* Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-16"
          >
            {[
              { icon: <ShieldCheck className="w-4 h-4" />, label: "25+ AI Bias Tools" },
              { icon: <Globe className="w-4 h-4" />, label: "Cloud Native" },
              { icon: <Zap className="w-4 h-4" />, label: "Google Cloud Powered" },
              { icon: <FileText className="w-4 h-4" />, label: "PDF / Word Reports" }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 px-6 py-3 bg-[#0F172A] border border-white/5 rounded-2xl text-[11px] font-bold text-slate-400">
                <span className="text-indigo-500">{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CSV UPLOAD SECTION ── */}
      <section className="py-24 px-6 bg-[#090D25]/50 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black text-white italic">Dataset Ingestion</h2>
            <p className="text-slate-400">Analyze your training data for hidden systematic biases.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <div 
                {...getRootProps()} 
                className={`h-80 border-2 border-dashed rounded-[40px] flex flex-col items-center justify-center transition-all cursor-pointer bg-[#0F172A]/40 ${isDragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-white/20'}`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 text-indigo-400">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase italic tracking-wider">Drag & Drop CSV</h3>
                <p className="text-sm text-slate-500 mb-8">Supported formats: .CSV (Max size 500MB)</p>
                <button className="px-6 py-3 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform">
                  Upload Dataset
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-8 rounded-[40px] bg-[#0F172A] border border-white/5 h-full">
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6">Inbound Metadata</h3>
                {uploadedFile ? (
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black">Dataset Name</p>
                      <p className="text-lg font-bold text-white truncate">{uploadedFile.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black">Rows</p>
                        <p className="text-xl font-bold text-white">{uploadedFile.rows}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black">Cols</p>
                        <p className="text-xl font-bold text-white">{uploadedFile.cols}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black">Quality Score</p>
                      <p className="text-3xl font-black text-emerald-400">{uploadedFile.score}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-slate-600">
                    <FileQuestion className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Waiting for data...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POWERBI STYLE DASHBOARD PREVIEW ── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Forensic Dashboard</h2>
              <p className="text-slate-400 max-w-xl">Deep analytics on data distribution and potential bias signals.</p>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" /> Filter Views
              </div>
              <div className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20">
                <LayoutGrid className="w-3.5 h-3.5" /> Export Data
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Records", value: "12,450", color: "text-indigo-400" },
              { label: "Columns", value: "24", color: "text-blue-400" },
              { label: "Missing Values", value: "0.2%", color: "text-emerald-400" },
              { label: "Data Quality Score", value: "85/100", color: "text-purple-400" }
            ].map((kpi, i) => (
              <div key={i} className="p-8 rounded-[30px] bg-[#0F172A] border border-white/5 hover:border-indigo-500/30 transition-all group">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{kpi.label}</p>
                <p className={`text-4xl font-black tracking-tighter ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-8 rounded-[40px] bg-[#0F172A] border border-white/5 min-h-[400px]">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-8 italic">Bias Variance by Feature</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#475569" 
                      fontSize={11} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={11} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #ffffff10', borderRadius: '12px' }}
                      itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="bias" fill="#6366f1" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="p-8 rounded-[40px] bg-[#0F172A] border border-white/5">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-8 italic">Overall Fairness Balance</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={pieData}
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="text-center">
                  <p className="text-3xl font-black text-white italic">75% FAIR</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Optimal Target: 90%+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DATA PREVIEW TABLE ── */}
      <section className="py-24 px-6 bg-[#070B1A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Data Preview</h2>
            <div className="flex items-center gap-4 bg-[#0F172A] border border-white/5 rounded-2xl px-4 py-2">
              <Search className="w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search dataset..." className="bg-transparent border-none focus:outline-none text-sm text-slate-300 w-64" />
            </div>
          </div>
          
          <div className="rounded-[30px] border border-white/5 bg-[#0F172A]/30 overflow-hidden backdrop-blur-xl">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                   <tr className="bg-white/5 border-b border-white/5">
                      {['ID', 'Age', 'Gender', 'Income', 'Occupation', 'Credit Score', 'Status'].map((head, i) => (
                        <th key={i} className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-slate-400">{head}</th>
                      ))}
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[12px] text-slate-300">
                   {[1, 2, 3, 4, 5].map((row) => (
                     <tr key={row} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-5 text-indigo-400 font-bold">#USR-{1000 + row}</td>
                        <td className="px-8 py-5">24</td>
                        <td className="px-8 py-5">Male</td>
                        <td className="px-8 py-5">$54,000</td>
                        <td className="px-8 py-5">Engineer</td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-2">
                             <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[70%]" />
                             </div>
                             712
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[9px] font-bold uppercase">Passed</span>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
             <div className="p-6 border-t border-white/5 flex justify-between items-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Showing 5 of 12,450 results</p>
                <div className="flex gap-2">
                   <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold hover:bg-white/10 transition-all uppercase">Prev</button>
                   <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold hover:bg-white/10 transition-all uppercase">Next</button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── AI INSIGHTS & BIAS ANALYSIS ── */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#070B1A] to-[#090D25]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* AI Insights Panel */}
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">AI Forensics</h2>
            <div className="grid gap-4">
              {[
                { title: "Outliers Detected", val: "142 Records", desc: "Anomalous patterns found in Income field.", icon: <Search /> },
                { title: "Data Imbalance", val: "Critical", desc: "Significant underrepresentation of Minority Group B.", icon: <ShieldAlert /> },
                { title: "Feature Importance", val: "High Variance", desc: "Age contributing 45% to decision skew.", icon: <Activity /> },
                { title: "Top Correlations", val: "0.89 Score", desc: "Gender strongly correlated with status outcome.", icon: <TrendingUp /> }
              ].map((insight, i) => (
                <div key={i} className="p-6 rounded-3xl bg-[#0F172A] border border-white/5 flex items-start gap-6 hover:border-indigo-500/30 transition-all">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
                    {insight.icon}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-black uppercase italic tracking-wider text-white">{insight.title}</h4>
                      <span className="text-[10px] font-bold text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded-full">{insight.val}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold tracking-tight">{insight.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bias Analysis & Gauge */}
          <div className="p-10 rounded-[40px] bg-[#0F172A] border border-white/10 shadow-3xl text-center space-y-10">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Fairness Metrics Audit</h3>
            
            <div className="relative inline-flex flex-col items-center">
              <div className="w-64 h-32 overflow-hidden relative">
                <div className="w-64 h-64 border-[16px] border-white/5 rounded-full relative">
                  <div className="absolute top-0 left-0 w-full h-full border-[16px] border-indigo-500/50 rounded-full clip-path-half" style={{ transform: 'rotate(45deg)' }} />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-24 bg-white origin-bottom scale-y-100 rounded-full shadow-[0_0_20px_white]" style={{ transform: 'rotate(25deg)' }} />
              </div>
              <div className="mt-4">
                <p className="text-5xl font-black text-white italic leading-none">0.82</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Fairness Gauge Meter</p>
              </div>
            </div>

            <div className="grid gap-3 pt-6">
              {[
                { name: "Demographic Parity", score: "0.78", status: "Fair" },
                { name: "Equal Opportunity", score: "0.85", status: "Excellent" },
                { name: "Disparate Impact", score: "0.82", status: "Good" }
              ].map((metric, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                   <span className="text-[10px] font-black uppercase italic text-slate-400">{metric.name}</span>
                   <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-white italic">{metric.score}</span>
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 bg-indigo-500/10 rounded-lg">{metric.status}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-24 px-6 bg-[#070B1A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">Everything you need for <br /> <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Responsible AI</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { t: "Smart Dataset Profiling", d: "Automatic schema detection and data quality scoring.", i: <Database /> },
              { t: "6 Fairness Metrics", d: "Demographic Parity, Equal Opportunity, Disparate Impact and more.", i: <Activity /> },
              { t: "Gemini AI Explanation", d: "Natural language insights into why bias exists.", i: <Sparkles /> },
              { t: "Visual Dashboard", d: "PowerBI style interactive data visualizations.", i: <BarChart3 /> },
              { t: "PDF Bias Reports", d: "Professional enterprise-ready audit documents.", i: <FileText /> },
              { t: "Explainable AI", d: "LIME/SHAP visual explanations for model decisions.", i: <Brain /> },
              { t: "Real-time Mitigation", d: "On-the-fly bias correction and data re-weighting.", i: <Zap /> },
              { t: "Data Anonymization", d: "Protect sensitive features while maintaining utility.", i: <ShieldCheck /> },
              { t: "Intersectional Bias", d: "Audit bias across multiple sensitive features at once.", i: <Users /> },
              { t: "Synthetic Dataset", d: "Generate bias-free training data automatically.", i: <Cpu /> },
              { t: "Multi-Model Support", d: "Audit XGBoost, Random Forest, Neural Networks.", i: <Layers /> },
              { t: "API Scanning", d: "Connect your existing inference endpoints.", i: <Globe /> },
              { t: "Custom Thresholds", d: "Define your own fairness tolerance levels.", i: <Filter /> },
              { t: "Bias Score Monitoring", d: "Track bias drift over time in production.", i: <TrendingUp /> }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-[40px] bg-[#0F172A] border border-white/5 hover:border-indigo-500/40 hover:translate-y-[-10px] transition-all group">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  {f.i}
                </div>
                <h3 className="text-lg font-black uppercase text-white italic tracking-tighter leading-none mb-3">{f.t}</h3>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SYSTEM ARCHITECTURE ── */}
      <section className="py-24 px-6 bg-[#090D25]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">System Architecture</h2>
             <p className="text-slate-500">Robust end-to-end pipeline for enterprise bias auditing.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch gap-4">
             {[
               { layer: "Frontend Layer", tech: ["Next.js", "React", "Tailwind"], color: "border-indigo-500/30" },
               { layer: "AI Layer", tech: ["Bias Detection Engine", "Fairness Metrics", "Explainable AI"], color: "border-purple-500/30" },
               { layer: "Backend Layer", tech: ["FastAPI", "Pandas", "Scikit-learn"], color: "border-cyan-500/30" },
               { layer: "Cloud Layer", tech: ["Google Cloud", "Docker", "API Gateway"], color: "border-emerald-500/30" }
             ].map((block, i) => (
               <div key={i} className={`flex-1 p-10 rounded-[50px] bg-[#0F172A] border-2 ${block.color} text-center space-y-6 flex flex-col justify-center`}>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white opacity-40">{block.layer}</h4>
                  <div className="space-y-2">
                     {block.tech.map((t, j) => (
                       <p key={j} className="text-lg font-black italic tracking-tighter text-white">{t}</p>
                     ))}
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY STACK ── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-10">Powering the Future of Ethical AI</p>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8 opacity-40 hover:opacity-100 transition-opacity">
            {['Next.js', 'React', 'Tailwind', 'Python', 'FastAPI', 'Pandas', 'Scikit-learn', 'Docker', 'Google Cloud', 'Gemini AI'].map((tech, i) => (
              <span key={i} className="px-6 py-3 bg-[#0F172A] border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM SECTION ── */}
      <section className="py-24 px-6 bg-[#070B1A]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">Meet the Team</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-10 rounded-[50px] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-center space-y-4">
                <div className="w-24 h-24 bg-white/10 rounded-full mx-auto flex items-center justify-center text-4xl mb-4">👨‍💻</div>
                <h4 className="text-2xl font-black text-white italic">Anish Kumar Raj</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Lead Developer & AI Engineer</p>
             </div>
             <div className="p-10 rounded-[50px] bg-[#0F172A] border border-white/5 text-center space-y-4 flex flex-col justify-center">
                <p className="text-sm font-bold text-slate-400 leading-relaxed italic uppercase tracking-tighter">
                  Dedicated to building algorithmic governance through decentralized fairness metrics.
                </p>
                <div className="pt-4">
                   <p className="text-lg font-black text-white italic">Synapse Squad Hub</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Google Solution Challenge 2026</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── SUSTENANCE / CTA ── */}
      <section className="py-40 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-indigo-600/10 blur-[200px] rounded-full" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-12">
           <h3 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.85]">Ready to Eliminate <br /> <span className="text-indigo-500">AI Bias?</span></h3>
           <Link href="/upload" className="inline-flex items-center gap-4 px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[30px] font-black uppercase tracking-widest shadow-[0_20px_60px_rgba(79,70,229,0.4)] transition-all hover:scale-110 active:scale-95 text-sm">
             Deploy FairAI Platform <ArrowRight className="w-6 h-6" />
           </Link>
        </div>
      </section>

    </div>
  );
}
