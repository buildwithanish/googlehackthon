"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Database, Zap, ArrowRight, ShieldCheck, BarChart3, 
  FileText, Cpu, Search, Filter, Layers, Users, Globe, 
  ShieldAlert, Sparkles, LayoutGrid, CheckCircle, Activity,
  Upload, FileQuestion, TrendingUp, PieChart, Info, Mail,
  ChevronRight, RefreshCw, Shuffle
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { useDropzone } from 'react-dropzone';

// Custom Icons to avoid Lucide Export Issues
const Github = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Twitter = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Linkedin = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

interface UploadedFileInfo {
  name: string;
  rows: string;
  cols: string;
  score: string;
}

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

const COLORS = ['#818cf8', '#f43f5e', '#10b981', '#f59e0b'];

export default function LandingPage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [feedbacks, setFeedbacks] = useState([
    { name: "Suresh Sharma", feedback: "The AI Bias Detection Engine is remarkably accurate and fast!", email: "suresh@example.com" }
  ]);
   const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [backendStatus, setBackendStatus] = useState<"idle" | "waking" | "ready" | "error">("idle");

  const [selectedFeature, setSelectedFeature] = useState<{t: string, d: string} | null>(null);

  const featuresList = [
    { t: "Smart Dataset Profiling", d: "FairAI analyze karta hai aapka dataset columns aur schema automatically, aur data quality score provide karta hai taaki aapko pata chale ki data audit ke liye ready hai ya nahi.", i: <Database className="w-6 h-6" /> },
    { t: "AI Bias Detection Engine", d: "Ye engine sophisticated statistical algorithms use karta hai jaise Disparate Impact aur Demographic Parity, hidden bias patterns ko pehchanne aur highlight karne ke liye.", i: <Search className="w-6 h-6" /> },
    { t: "Explainable AI (XAI)", d: "Decision causality visualization ensure karta hai ki AI ke faisle transparency ke sath samajh mein aayein, LIME aur SHAP indicators ke madhyam se.", i: <Brain className="w-6 h-6" /> },
    { t: "Fairness Metrics Analyzer", d: "Humaara analyzer global standards jaise Demographic Parity aur Equal Opportunity ka audit karta hai, aapke model ki fairness score calculate karne ke liye.", i: <Activity className="w-6 h-6" /> },
    { t: "Bias Risk Score", d: "Saare detect kiye gaye biases ko summarize karke ek single Risk Score dia jata hai, jo governance compliance ke liye crucial hai.", i: <ShieldAlert className="w-6 h-6" /> },
    { t: "Automated Bias Mitigation", d: "Detect karne ke baad, FairAI suggest karta hai mitigation steps, jaise re-weighting techniques, taaki outcomes fair ho sakein.", i: <Zap className="w-6 h-6" /> },
    { t: "Dataset Bias Heatmap", d: "Heatmap visualization se aap dekh sakte hain ki bias dataset ke kaunse demographic slices mein sabse zyada condensed hai.", i: <LayoutGrid className="w-6 h-6" /> },
    { t: "Intersectional Bias Detection", d: "Sirf single feature nahi, balki multiple combinations (jaise Race + Gender) ke nested biases ko bhi handle karta hai humaara system.", i: <Users className="w-6 h-6" /> },
    { t: "PowerBI Style Dashboard", d: "Professional level graphics aur interactive forensic visualizations jo enterprise decision makers ke liye design kiye gaye hain.", i: <BarChart3 className="w-6 h-6" /> },
    { t: "Real Time Data Visualization", d: "Data distributions aur active monitoring ke sath live charting dashboard jo instantly update hota hai.", i: <TrendingUp className="w-6 h-6" /> },
    { t: "Feature Importance Analysis", d: "Ye feature highlight karta hai ki kaunse columns (variables) AI ke outcomes ko sabse zyada bias kar rahe hain.", i: <Activity className="w-6 h-6" /> },
    { t: "Correlation Matrix", d: "Multi-variable structural relationships ko visualize karke hidden dependencies detect karein jo fairness ko impact kar sakte hain.", i: <Layers className="w-6 h-6" /> },
    { t: "Synthetic Dataset Generator", d: "Agar training data mein bias hai, toh ye feature bias-free synthetic records generate karne mein madad karta hai.", i: <Cpu className="w-6 h-6" /> },
    { t: "Data Anonymization", d: "Sensitive features ko high-utility masking ke sath protect karta hai, taaki auditing process privacy-compliant rahe.", i: <ShieldCheck className="w-6 h-6" /> },
    { t: "Smart Data Cleaning", d: "Automated outlier detection aur missing value imputation jo datasets ko auditing aur training ke liye optimize karta hai.", i: <RefreshCw className="w-6 h-6" /> },
    { t: "AI Governance Dashboard", d: "Regulatory monitoring aur standard compliance records maintain karne ke liye ek central command center.", i: <Globe className="w-6 h-6" /> },
    { t: "Responsible AI Report", d: "Ek click mein generate karein professional PDF reports jo stakeholders ke audit trails ke liye ready hote hain.", i: <FileText className="w-6 h-6" /> },
    { t: "Live Bias Simulator", d: "Interactive what-if scenarios chalaayein aur dekhein ki parameters badalne se model ki fairness pe kya asar padta hai.", i: <Zap className="w-6 h-6" /> },
    { t: "Demo Dataset Mode", d: "Platform ko test karne ke liye hume pre-loaded biased scenarios provide karte hain, bina apna data upload kiye.", i: <Database className="w-6 h-6" /> },
    { t: "One Click Bias Scan", d: "Configuration ki koi chinta nahi, bas file drop karein aur pura audit analysis instantly generate karein.", i: <CheckCircle className="w-6 h-6" /> }
  ];

  const handleFeedbackSubmit = () => {
    if (feedbackName && feedbackText) {
      setFeedbacks([{ name: feedbackName, email: feedbackEmail, feedback: feedbackText }, ...feedbacks]);
      setFeedbackName("");
      setFeedbackEmail("");
      setFeedbackText("");
    }
  };

  // ── Wake up Backend ──
  useEffect(() => {
    const wakeup = async () => {
      setBackendStatus("waking");
      try {
        const { pingHealth } = await import("@/lib/api");
        const isUp = await pingHealth();
        if (isUp) setBackendStatus("ready");
        else {
          // Retry logic if first ping fails after a delay
          setTimeout(async () => {
            const retry = await pingHealth();
            setBackendStatus(retry ? "ready" : "error");
          }, 15000); // Wait 15s for Render to spin up
        }
      } catch (e) {
        // Suppress initial errors during wakeup
      }
    };
    wakeup();
  }, []);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const file = acceptedFiles[0];
      // Note: we'll call import from lib/api but since I'm in a client component 
      // I should ideally use the Dynamic import or ensure api is loaded.
      // For now let's assume uploadDataset is available if imported.
      const { uploadDataset } = await import("@/lib/api");
      const result = await uploadDataset(file);
      
      setUploadedFile({
        name: file.name,
        rows: result.rows?.toLocaleString() || "N/A",
        cols: result.cols?.toString() || "N/A",
        score: result.quality_score ? `${result.quality_score}/100` : "Audit Ready"
      });
    } catch (err: any) {
      setUploadError(err.message || "Upload failed. Backend might be sleeping.");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false
  });

  return (
    <div className="flex flex-col w-full bg-[#050816] text-slate-200 overflow-x-hidden">
      
      {/* ── HIGH-END HERO SECTION ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-[0.02] pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Built for Google Solution Challenge 2026
            </div>
            <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md transition-all ${
              backendStatus === "ready" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : 
              backendStatus === "waking" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : 
              "bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${backendStatus === "ready" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-amber-500 animate-pulse"}`} />
              {backendStatus === "ready" ? "Neural Core Connected" : backendStatus === "waking" ? "Connecting to Core..." : "Core Link Failure - Refresh"}
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                textShadow: "0 0 50px rgba(99, 102, 241, 0.8)",
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl md:text-[11rem] font-black tracking-tighter leading-none text-white select-none cursor-default bg-clip-text hover:text-transparent hover:bg-gradient-to-br hover:from-white hover:via-indigo-300 hover:to-indigo-500 transition-all duration-500"
            >
              FairAI
            </motion.h1>
            <motion.h2
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3, duration: 1 }}
               className="text-3xl md:text-5xl font-black italic tracking-tight text-slate-400 uppercase"
            >
               Bias <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Detection Platform</span>
            </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto leading-relaxed font-medium italic"
          >
            Addressing the <span className="text-white">Unbiased AI Decision</span> theme by building open innovation protocols that audit, explain, and mitigate algorithmic discrimination in real-world infrastructure.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center items-center pt-8"
          >
            <Link href="/upload" className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:scale-110 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)] overflow-hidden">
               <span className="relative z-10 flex items-center gap-3">
                 <Database className="w-5 h-5" /> Upload Dataset
               </span>
            </Link>
            <Link href="/simulator" className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:bg-white/10 hover:scale-110 active:scale-95 flex items-center gap-3 backdrop-blur-xl">
               <Zap className="w-5 h-5 text-indigo-400" /> Try Live Demo
            </Link>
            <Link href="/metrics" className="px-10 py-5 bg-indigo-600 border border-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:bg-indigo-500 hover:scale-110 active:scale-95 flex items-center gap-3 backdrop-blur-xl shadow-xl">
               <Activity className="w-5 h-5 text-white" /> Run Bias Analysis
            </Link>
          </motion.div>

          {/* Trust indicators / Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto pt-24"
          >
            {[
              { icon: <ShieldCheck />, label: "25+ AI Bias Tools" },
              { icon: <Globe />, label: "Cloud Native" },
              { icon: <Zap />, label: "Google Cloud Powered" },
              { icon: <FileText />, label: "PDF / Word Reports" }
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-6 bg-[#0B1023]/40 border border-white/5 rounded-3xl backdrop-blur-sm group hover:border-indigo-500/30 transition-all">
                <span className="text-indigo-500 group-hover:scale-110 transition-transform">{badge.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MISSION / HOW IT WORKS SECTION ── */}
      <section className="py-24 px-6 bg-[#0B1023]/20 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16 text-center">
           <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">AI Bias Detection <span className="text-indigo-500">System</span></h2>
              <p className="text-slate-400 max-w-2xl font-bold uppercase tracking-widest text-sm">Humaara platform AI algorithms mein un-fairness aur discrimination ko khatam karne ke liye banaya gaya hai.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
              {[
                { title: "1. Upload Data", desc: "Apna CSV upload karein. Humaara engine features identify karke data patterns scan karta hai.", icon: <Upload className="w-8 h-8 text-indigo-400" /> },
                { title: "2. Scan Biases", desc: "Scientific metrics ke zariye hum detect karte hain ki system kis group ke saath pakshpaat kar raha hai.", icon: <Search className="w-8 h-8 text-indigo-400" /> },
                { title: "3. Fix & Report", desc: "Mitigation steps follow karein aur Gemini AI-powered audited reports download karein.", icon: <Sparkles className="w-8 h-8 text-indigo-400" /> }
              ].map((step, i) => (
                <div key={i} className="p-10 rounded-[40px] bg-[#0B1023] border border-white/5 space-y-6 hover:translate-y-[-10px] transition-all">
                   <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">{step.icon}</div>
                   <h4 className="text-xl font-black text-white italic uppercase">{step.title}</h4>
                   <p className="text-sm text-slate-500 font-medium italic">{step.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ── PREMIUM CSV UPLOAD INTERFACE ── */}
      <section className="py-32 px-6 bg-[#0B1023]/20 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
             <div className="lg:w-1/2 space-y-8">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white italic uppercase leading-[0.85]">
                   Seamless <br /> <span className="text-indigo-500">Data Ingestion</span>
                </h2>
                <p className="text-slate-500 text-lg font-bold leading-relaxed italic uppercase tracking-tight">
                   Our high-performance engine supports multi-encoding CSV files up to 500MB. Upload and let FairAI profile your data health in real-time.
                </p>
                <div className="flex gap-10">
                   <div>
                      <p className="text-3xl font-black text-white italic tracking-tighter">500MB</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Max capacity</p>
                   </div>
                   <div>
                      <p className="text-3xl font-black text-indigo-500 italic tracking-tighter">128ms</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Parsing latency</p>
                   </div>
                </div>
             </div>
             
             <div className="lg:w-1/2 w-full">
                <div 
                  {...getRootProps()} 
                  className={`relative p-12 md:p-20 rounded-[60px] border-2 border-dashed transition-all cursor-pointer bg-[#0B1023] shadow-3xl ${isDragActive ? 'border-indigo-500 bg-indigo-500/5 shadow-indigo-500/10' : 'border-white/10 hover:border-indigo-500/30 group'}`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-[30px] flex items-center justify-center mb-10 text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                      <Upload className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 uppercase italic tracking-widest">
                      {isUploading ? "Uploading..." : "Drop your CSV here"}
                    </h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10">UTF-8 • ISO-8859 • MacRoman</p>
                    
                    {uploadError && (
                      <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] font-bold uppercase tracking-widest">
                        {uploadError}
                      </div>
                    )}

                    <button className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                      Browse Files
                    </button>
                  </div>
                  
                  {/* Floating Metadata Indicator */}
                  <AnimatePresence>
                    {uploadedFile && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute -bottom-10 -right-10 bg-[#0B1023] border border-white/10 p-10 rounded-[40px] shadow-4xl w-72 backdrop-blur-3xl"
                      >
                         <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Inbound Profile</h4>
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-[11px] font-bold mb-2">
                               <span className="text-slate-500 uppercase tracking-tight italic">Dataset</span>
                               <span className="text-white italic truncate max-w-[120px]">{uploadedFile.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold">
                               <span className="text-slate-500 uppercase tracking-tight italic">Records</span>
                               <span className="text-white italic">{uploadedFile.rows}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold">
                               <span className="text-slate-500 uppercase tracking-tight italic">Columns</span>
                               <span className="text-white italic">{uploadedFile.cols}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold mt-2 pt-2 border-t border-white/10">
                               <span className="text-slate-500 uppercase tracking-tight italic">Score</span>
                               <span className="text-emerald-400 font-black italic">{uploadedFile.score}</span>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── POWERBI STYLE ANALYTICS DASHBOARD ── */}
      <section className="py-40 px-6 relative overflow-hidden bg-[#050816]">
        <div className="absolute top-1/2 left-0 w-[40%] h-[40%] bg-indigo-600/[0.03] rounded-full blur-[160px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-4">
               <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white italic uppercase leading-none">
                  Professional <br /> <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Analytics Suite</span>
               </h2>
               <p className="text-slate-500 text-lg font-bold italic tracking-tight uppercase">High-fidelity forensic visualization for dataset clusters.</p>
            </div>
            <div className="flex gap-4">
               <div className="px-6 py-3 bg-[#0B1023] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-3">
                  <Filter className="w-4 h-4" /> Filter Clusters
               </div>
               <div className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl overflow-hidden relative group transition-all hover:scale-105 active:scale-95">
                  <LayoutGrid className="w-4 h-4" /> Export Report
               </div>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { label: "Total Records", value: "12,450", trend: "+3.2%", color: "text-indigo-400" },
               { label: "Total Columns", value: "24", trend: "0.0", color: "text-blue-400" },
               { label: "Missing Values", value: "0.2%", trend: "-0.1%", color: "text-emerald-400" },
               { label: "Data Quality Score", value: "85/100", trend: "Target: 90", color: "text-purple-400" }
             ].map((kpi, i) => (
               <div key={i} className="p-10 rounded-[40px] bg-[#0B1023] border border-white/5 group hover:border-indigo-500/20 transition-all shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{kpi.label}</p>
                     <p className="text-[9px] font-black text-indigo-500 uppercase">{kpi.trend}</p>
                  </div>
                  <p className={`text-5xl font-black tracking-tighter italic ${kpi.color}`}>{kpi.value}</p>
               </div>
             ))}
          </div>

          {/* Chart Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 p-12 rounded-[50px] bg-[#0B1023] border border-white/5 min-h-[500px] shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                   <BarChart3 className="w-64 h-64" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-12 italic">Bias Distribution Matrix</h3>
                <div className="h-[400px] w-full relative z-10">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#475569" 
                          fontSize={11} 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontWeight: 800 }}
                        />
                        <YAxis 
                          stroke="#475569" 
                          fontSize={11} 
                          axisLine={false} 
                          tickLine={false} 
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                          contentStyle={{ backgroundColor: '#0B1023', border: '1px solid #ffffff10', borderRadius: '24px', padding: '16px' }}
                          itemStyle={{ color: '#818cf8', fontWeight: '900', fontSize: '12px' }}
                        />
                        <Bar dataKey="bias" fill="#6366f1" radius={[12, 12, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="p-12 rounded-[50px] bg-[#0B1023] border border-white/5 flex flex-col items-center justify-center text-center shadow-2xl">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-12 italic w-full text-left">System Ethics Balance</h3>
                <div className="h-[300px] w-full relative">
                   <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={pieData}
                          innerRadius={90}
                          outerRadius={120}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-5xl font-black text-white italic tracking-tighter">75%</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">FAIR</p>
                   </div>
                </div>
                <div className="mt-12 space-y-4 w-full">
                   <div className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Target Parity</span>
                      <span className="text-xs font-black text-emerald-400 italic">0.90+</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Disparity Index</span>
                      <span className="text-xs font-black text-rose-500 italic">LOW</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── EXCEL STYLE DATA TABLE ── */}
      <section className="py-40 px-6 bg-[#050816]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Raw Intelligence <span className="text-slate-600">Matrix</span></h3>
            <div className="flex items-center gap-6 w-full md:w-auto">
               <div className="flex items-center gap-3 bg-[#0B1023] border border-white/10 rounded-2xl px-6 py-3 flex-grow md:flex-none">
                  <Search className="w-5 h-5 text-slate-500" />
                  <input type="text" placeholder="Search matrix..." className="bg-transparent border-none focus:outline-none text-sm font-bold text-slate-300 w-full md:w-64 placeholder:text-slate-600 italic" />
               </div>
               <button className="p-4 bg-[#0B1023] border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
                  <RefreshCw className="w-5 h-5" />
               </button>
            </div>
          </div>
          
          <div className="rounded-[40px] border border-white/5 bg-[#0B1023]/30 overflow-hidden backdrop-blur-3xl shadow-4xl transform-gpu">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                   <thead>
                      <tr className="bg-white/[0.04] border-b border-white/5">
                         {['ID', 'Timestamp', 'Group', 'Outcome', 'Profit', 'Credit Score', 'Stability'].map((head, i) => (
                           <th key={i} className="px-10 py-6 font-black uppercase text-[11px] tracking-[0.2em] text-slate-500 italic">{head}</th>
                         ))}
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 font-mono text-[12px] text-slate-300">
                      {[1, 2, 3, 4, 5, 6].map((row) => (
                        <tr key={row} className="hover:bg-indigo-600/[0.03] transition-colors group">
                           <td className="px-10 py-6 text-indigo-400 font-black">#AUD-{1000 + row}</td>
                           <td className="px-10 py-6 font-bold text-slate-500">2026-04-12 14:32:0{row}</td>
                           <td className="px-10 py-6 group-hover:text-white transition-colors uppercase font-black tracking-tight">{row % 2 === 0 ? 'Group A' : 'Group B'}</td>
                           <td className="px-10 py-6">
                              <span className={`px-4 py-1.5 rounded-xl font-black uppercase text-[9px] tracking-widest ${row % 3 === 0 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                 {row % 3 === 0 ? 'Denied' : 'Approved'}
                              </span>
                           </td>
                           <td className="px-10 py-6 italic font-black text-indigo-100">$ {row * 1250}.00</td>
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                   <div className={`h-full ${row > 3 ? 'bg-indigo-500' : 'bg-emerald-500'} w-[${40 + (row*10)}%] shadow-[0_0_10px_white]`} />
                                </div>
                                <span className="font-black italic">{600 + (row * 20)}</span>
                              </div>
                           </td>
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase text-emerald-500">Nominal</span>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="p-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Displaying forensic instances 1–6 of 12,450</p>
                <div className="flex gap-4">
                   <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all italic">Previous Table</button>
                   <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all italic">Next Table</button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── AI INSIGHTS & BIAS FORENSICS ── */}
      <section className="py-40 px-6 bg-gradient-to-b from-[#050816] to-[#0A0D20]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          <div className="space-y-12">
            <div className="space-y-4">
               <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">AI Insight <br /> <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Forensics</span></h2>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Automated reasoning for complex data patterns.</p>
            </div>
            
            <div className="grid gap-6">
              {[
                { title: "Variable Correlations", val: "0.89 Index", desc: "Gender strongly correlated with binary status outcome.", icon: <Shuffle className="w-6 h-6" /> },
                { title: "Anomaly Detection", val: "142 Signal", desc: "Outlier patterns identified in Income distribution.", icon: <Search className="w-6 h-6" /> },
                { title: "Class Imbalance", val: "Critical", desc: "Significant underrepresentation of Minority Group B.", icon: <ShieldAlert className="w-6 h-6" /> },
                { title: "Feature Importance", val: "High Variance", desc: "Age contributes 45% to decision weighting skew.", icon: <TrendingUp className="w-6 h-6" /> }
              ].map((insight, i) => (
                <div key={i} className="p-8 rounded-[40px] bg-[#0B1023] border border-white/5 flex items-start gap-8 hover:border-indigo-500/30 transition-all shadow-xl group">
                  <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 group-hover:bg-indigo-600/10 transition-all duration-500">
                    {insight.icon}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <h4 className="text-lg font-black uppercase italic tracking-tighter text-white leading-none">{insight.title}</h4>
                       <span className="text-[10px] font-black tracking-widest text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">{insight.val}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-bold tracking-tight italic">{insight.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-16 rounded-[60px] bg-[#0B1023] border border-white/10 shadow-4xl text-center space-y-16 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/[0.03] to-transparent pointer-events-none" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 relative z-10 italic">Scientific Fairness Audit</h3>
            
            <div className="relative inline-flex flex-col items-center z-10">
              <div className="w-80 h-40 overflow-hidden relative">
                <div className="w-80 h-80 border-[24px] border-white/5 rounded-full relative">
                  <div className="absolute top-0 left-0 w-full h-full border-[24px] border-indigo-500/50 rounded-full clip-path-half" style={{ transform: 'rotate(45deg)' }} />
                </div>
                {/* Needle */}
                <motion.div 
                  initial={{ rotate: -90 }}
                  whileInView={{ rotate: 25 }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-32 bg-white origin-bottom rounded-full shadow-[0_0_30px_white]"
                />
              </div>
              <div className="mt-8 space-y-2">
                <p className="text-7xl font-black text-white italic leading-none tracking-tighter">0.82</p>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Fairness Confidence Gauge</p>
              </div>
            </div>

            <div className="grid gap-4 pt-10 relative z-10 text-left">
              {[
                { name: "Demographic Parity", score: "0.78", status: "Fair" },
                { name: "Equal Opportunity", score: "0.85", status: "Optimal" },
                { name: "Disparate Impact", score: "0.82", status: "Stable" }
              ].map((metric, i) => (
                <div key={i} className="flex justify-between items-center p-6 bg-white/[0.03] rounded-[30px] border border-white/5 hover:bg-white/[0.06] transition-all group/stat">
                   <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover/stat:scale-150 transition-transform" />
                      <span className="text-[11px] font-black uppercase italic tracking-widest text-slate-400">{metric.name}</span>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className="text-2xl font-black text-white italic tracking-tighter">{metric.score}</span>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-4 py-1.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">{metric.status}</span>
                   </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-6 bg-white/5 border border-white/10 rounded-[30px] text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 transition-all flex items-center justify-center gap-4 group/btn relative z-10 italic">
               View Comprehensive Audit Report <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* ── PREMIUM FEATURES SECTION ── */}
      <section className="py-40 px-6 bg-[#050816]">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <h2 className="text-6xl md:text-[9rem] font-black text-white italic tracking-tighter uppercase leading-[0.8] select-none opacity-90">
               Responsible <br /> <span className="text-indigo-500">AI Ecosystem</span>
            </h2>
            <p className="text-slate-500 text-xl font-bold italic tracking-tight uppercase">Everything required for technical algorithmic governance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuresList.map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -15, scale: 1.02 }}
                className="group p-10 rounded-[50px] bg-[#0B1023] border border-white/5 hover:border-indigo-500/40 transition-all shadow-2xl shadow-black/60 flex flex-col justify-between overflow-hidden relative"
              >
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-[80px] group-hover:bg-indigo-600/20 transition-all" />
                
                <div>
                  <div className="w-16 h-16 bg-white/[0.03] border border-white/5 rounded-3xl flex items-center justify-center text-indigo-400 mb-8 group-hover:bg-indigo-600/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                    {f.i}
                  </div>
                  <h3 className="text-xl font-black uppercase text-white italic tracking-tighter leading-none mb-4 group-hover:text-indigo-300 transition-colors line-clamp-1">{f.t}</h3>
                  <p className="text-[12px] text-slate-500 font-bold leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity uppercase tracking-tight mb-8 line-clamp-2">
                    {f.d}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 mt-auto">
                   <div className="flex gap-2">
                     <Link href="/upload" className="flex-1 px-4 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 hover:text-white transition-all text-center flex items-center justify-center gap-2">
                       Live <ArrowRight className="w-3 h-3" />
                     </Link>
                     <Link href="/simulator" className="flex-1 px-4 py-3 bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all text-center flex items-center justify-center gap-2">
                       Demo <ChevronRight className="w-3 h-3" />
                     </Link>
                   </div>
                   <button 
                    onClick={() => setSelectedFeature({t: f.t, d: f.d})}
                    className="w-full px-4 py-3 border border-white/5 bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:border-indigo-500/30 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 italic"
                   >
                     <Info className="w-3 h-3" /> Read More
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE MODAL ── */}
      <AnimatePresence>
        {selectedFeature && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedFeature(null)}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
             />
             <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full bg-[#0B1023] border border-white/10 p-12 rounded-[50px] shadow-4xl text-left space-y-8"
             >
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{selectedFeature.t}</h3>
                  <div className="h-1 w-20 bg-indigo-500 rounded-full" />
                </div>
                <p className="text-lg text-slate-300 font-bold italic leading-relaxed border-l-4 border-white/5 pl-8">
                  {selectedFeature.d}
                </p>
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl transition-all"
                >
                  Close Insight
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── SYSTEM ARCHITECTURE VIZ ── */}
      <section className="py-40 px-6 bg-[#0B1023]/20 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
          <div className="text-center space-y-4">
             <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">System Architecture</h2>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Distributed Audit Pipeline Engineering.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
             {[
               { layer: "Frontend Layer", tech: ["Next.js 14", "React", "TailwindCSS"], icon: <LayoutGrid className="w-6 h-6" />, color: "border-indigo-500/30" },
               { layer: "AI Layer", tech: ["Bias Detection Engine", "Explainable AI (XAI)", "Gemini Reasoning"], icon: <Brain className="w-6 h-6" />, color: "border-purple-500/30" },
               { layer: "Backend Layer", tech: ["FastAPI", "Pandas", "Scikit-learn"], icon: <Database className="w-6 h-6" />, color: "border-cyan-500/30" },
               { layer: "Cloud Layer", tech: ["Google Cloud Platform", "Docker Containerization", "API Gateway"], icon: <Globe className="w-6 h-6" />, color: "border-emerald-500/30" }
             ].map((block, i) => (
               <div key={i} className={`flex-1 p-12 rounded-[60px] bg-[#0B1023] border-t-4 ${block.color} text-left space-y-10 flex flex-col justify-between shadow-2xl group hover:-translate-y-4 transition-all`}>
                  <div className="space-y-6">
                    <div className="p-4 bg-white/5 rounded-2xl w-fit text-slate-400 group-hover:text-white transition-colors">
                      {block.icon}
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">{block.layer}</h4>
                    <div className="space-y-4">
                       {block.tech.map((t, j) => (
                         <div key={j} className="flex items-center gap-3">
                            <div className="w-1 h-1 rounded-full bg-indigo-500" />
                            <p className="text-lg font-black italic tracking-tighter text-white uppercase">{t}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="pt-10 flex justify-end">
                     <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-indigo-500 transition-colors" />
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY STACK BADGES ── */}
      <section className="py-24 px-6 border-b border-white/5 bg-[#050816]">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-600 mb-10">Powering Autonomous Algorithmic Fairness</p>
          <div className="flex flex-wrap justify-center gap-6 opacity-30 hover:opacity-100 transition-all duration-700 transform-gpu">
            {['Next.js', 'React', 'TailwindCSS', 'Framer Motion', 'Recharts', 'Python', 'FastAPI', 'Pandas', 'Scikit Learn', 'Docker', 'Google Cloud', 'Gemini AI'].map((tech, i) => (
              <span key={i} className="px-10 py-5 bg-[#0B1023] border border-white/10 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap shadow-xl hover:border-indigo-500/30 hover:bg-white/5 transition-all cursor-crosshair italic">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO SECTION ── */}
      <section className="py-40 px-6 bg-[#0B1023]/20 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-16 relative z-10">
           <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">Try the Platform Live</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Experience the power of the Bias Detection Engine instantly.</p>
           
           <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
             <Link href="/simulator" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-110 active:scale-95 transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)]">
               Try Demo
             </Link>
             <Link href="/upload" className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-110 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
               Upload Dataset
             </Link>
             <Link href="/ai-report" className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 hover:scale-110 active:scale-95 transition-all">
               View Sample Report
             </Link>
           </div>
        </div>
      </section>

      {/* ── FEEDBACK SECTION ── */}
      <section className="py-40 px-6 bg-[#050816]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">User Feedback</h2>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Help us improve the fairness audit ecosystem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.form 
              whileHover={{ scale: 1.02 }}
              className="p-12 rounded-[50px] bg-[#0B1023] border border-white/10 shadow-2xl flex flex-col gap-8 transition-all duration-300"
            >
               <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Name</label>
                  <input type="text" value={feedbackName} onChange={(e) => setFeedbackName(e.target.value)} placeholder="Jane Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors font-medium outline-none" />
               </div>
               <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Email Address</label>
                  <input type="email" value={feedbackEmail} onChange={(e) => setFeedbackEmail(e.target.value)} placeholder="jane@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors font-medium outline-none" />
               </div>
               <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Feedback</label>
                  <textarea rows={4} value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Your thoughts on the bias detection engine..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors font-medium outline-none resize-none" />
               </div>
               <button type="button" onClick={handleFeedbackSubmit} className="mt-4 px-8 py-5 bg-indigo-600 w-full rounded-2xl text-white font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-colors shadow-[0_10px_30px_rgba(79,70,229,0.3)]">
                  Submit Feedback
               </button>
            </motion.form>
            
            <div className="p-12 rounded-[50px] bg-[#0B1023]/50 border border-white/5 flex flex-col gap-6 h-[600px] overflow-y-auto custom-scrollbar">
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4">Recent Submissions</h3>
               <AnimatePresence>
                 {feedbacks.map((fb, idx) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="p-6 bg-[#0B1023] border border-white/10 rounded-3xl space-y-3"
                   >
                     <div className="flex justify-between items-center">
                       <span className="text-indigo-400 font-black italic">{fb.name}</span>
                       <span className="text-[9px] text-slate-500 uppercase tracking-widest">Just now</span>
                     </div>
                     <p className="text-sm text-slate-300 font-medium italic">{fb.feedback}</p>
                   </motion.div>
                 ))}
               </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM SECTION ── */}
      <section className="py-40 px-6 bg-[#0B1023]/20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter">Meet The Team</h2>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Visionaries behind the intelligence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
             {[
               { name: "Amrit Anand", role: "rounakjha122@gmail.com", avatar: "🧑‍💻" },
               { name: "Kapil Vishwakarma", role: "kapilbhai758@gmail.com", avatar: "👤" },
               { name: "Subham Sharma", role: "subhamsharma765688@gmail.com", avatar: "👨‍💻" },
               { name: "Anish Raj", role: "anishkumar9905287@gmail.com", avatar: "🌟", badge: "(Leader)" }
             ].map((member, i) => (
               <motion.div 
                 key={i}
                 whileHover={{ y: -5 }}
                 className="p-8 rounded-[40px] bg-[#0B1023] border border-white/10 shadow-xl flex items-center gap-6 group hover:border-indigo-500/30 transition-all font-outfit"
               >
                  <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-3xl border border-white/5 bg-gradient-to-br from-white/10 to-white/5 text-white/80 group-hover:scale-110 transition-transform shadow-lg overflow-hidden">
                     {member.avatar}
                  </div>
                  <div className="space-y-1 w-full flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold text-white tracking-tight">{member.name} {member.badge && <span className="text-yellow-400 text-[10px] ml-1 uppercase italic tracking-widest">{member.badge}</span>}</h4>
                      <p className="text-[11px] font-medium tracking-wide text-slate-400 italic">{member.role}</p>
                    </div>
                    <div className="text-slate-600 group-hover:text-white transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                    </div>
                  </div>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* ── FINAL PRODUCT CTA ── */}
      <section className="py-60 text-center relative overflow-hidden bg-[#050816]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-indigo-600/10 blur-[240px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-16">
           <div className="space-y-6">
              <h3 className="text-7xl md:text-[12rem] font-black italic uppercase tracking-tighter text-white leading-[0.75] select-none">Start Your <br /> <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Fair AI</span> Audit</h3>
              <p className="text-slate-500 text-xl font-black uppercase tracking-widest italic pt-10">The professional standard for responsive data intelligence.</p>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link href="/upload" className="group relative px-16 py-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[40px] font-black uppercase tracking-[0.3em] shadow-[0_30px_80px_rgba(79,70,229,0.4)] transition-all hover:scale-110 active:scale-95 text-sm flex items-center gap-6 italic">
                Launch Enterprise Platform <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </Link>
           </div>
        </div>
      </section>

    </div>
  );
}
