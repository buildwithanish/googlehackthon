"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, Database, ShieldAlert, Sparkles, AlertCircle, 
  CheckCircle2, ArrowRight, Table as TableIcon, Activity,
  RefreshCw, CloudOff, Info, Layers, Zap, LayoutGrid,
  ChevronRight, ArrowDownLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadDataset, pingHealth } from "@/lib/api";
import DashboardInsights from "@/components/DashboardInsights";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const router = useRouter();

  const handleUpload = async (selectedFile: File) => {
    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setShowReport(false);
    setLoadingMessage("Waking up AI Engine...");

    try {
      let isHealthy = false;
      let attempts = 0;
      while (!isHealthy && attempts < 5) {
          isHealthy = await pingHealth();
          if (!isHealthy) {
              attempts++;
              setLoadingMessage(`Starting AI Engine (Attempt ${attempts}/5)...`);
              await new Promise(r => setTimeout(r, 3000));
          }
      }

      if (!isHealthy) {
          throw new Error("AI Engine is currently unavailable. Please try again later.");
      }

      setLoadingMessage("Scanning Dataset Integrity...");
      setUploadProgress(40);
      const res = await uploadDataset(selectedFile);
      
      if (res.success) {
        setUploadProgress(100);
        setLoadingMessage("Dataset Captured. Initializing BI Clusters...");
        
        localStorage.setItem("dataset_info", JSON.stringify({
          file_id: res.file_id,
          filename: selectedFile.name,
          stats: res.stats,
          target_column: res.target_column || "none",
          sensitive_column_hints: res.sensitive_column_hints || ["none"]
        }));

        setTimeout(() => {
          setUploading(false);
          setShowReport(true);
        }, 2000);

      } else {
        throw new Error(res.error || "Dataset ingestion failed.");
      }
    } catch (err: any) {
      setError(err.message || "Network Error: Could not reach AI Engine.");
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
        setFile(selectedFile);
        handleUpload(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#050816] font-outfit pb-32">
      
      {/* ── PREMIUM UPLOAD SECTION ── */}
      <section className="w-full relative flex flex-col items-center justify-center px-6 py-32 overflow-hidden border-b border-white/5 bg-[#0B1023]/20 backdrop-blur-3xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-indigo-600/[0.03] rounded-full blur-[160px]" />
          <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-600/[0.03] rounded-full blur-[140px]" />
        </div>

        <div className="max-w-5xl w-full space-y-20 relative z-10 text-center">
          
          <div className="space-y-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 backdrop-blur-md mb-2 italic"
            >
              <Zap className="w-4 h-4 animate-pulse" /> High-Performance AI Logic Active
            </motion.div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
              Ingest Your <br /> <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic tracking-tight">Universal Dataset</span>
            </h1>
            
            <p className="text-slate-500 text-lg font-bold uppercase tracking-tight max-w-2xl mx-auto italic leading-relaxed">
              Autonomous Bias Detection • High-Fidelity Matrix Analysis. <br />
              <span className="text-slate-700">Built for Google Solution Challenge 2026</span>
            </p>

            {/* DEMO DATA SHORTCUT */}
            <div className="flex justify-center gap-6 pt-6">
               <button 
                 onClick={async () => {
                   setUploading(true);
                   setLoadingMessage("Fetching Random Demo Scenario...");
                   try {
                     const randomIndex = Math.floor(Math.random() * 50) + 1;
                     const response = await fetch(`/demo_datasets/demo_audit_${randomIndex}.csv`);
                     const blob = await response.blob();
                     const demoFile = new File([blob], `demo_audit_scenario_${randomIndex}.csv`, { type: "text/csv" });
                     handleUpload(demoFile);
                   } catch (e) {
                     setError("Demo load failed. Please upload manually.");
                     setUploading(false);
                   }
                 }}
                 className="px-8 py-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all italic flex items-center gap-3 backdrop-blur-xl group"
               >
                 <Sparkles className="w-4 h-4 group-hover:animate-spin" /> Try Demo Dataset
               </button>
               <a 
                 href="/demo_datasets/loan_audit_demo.csv" 
                 download 
                 className="px-8 py-3 bg-white/5 border border-white/10 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-white/30 hover:text-white transition-all italic flex items-center gap-3"
               >
                 <Database className="w-4 h-4" /> Download Sample CSV
               </a>
            </div>
          </div>

          <div className="max-w-4xl mx-auto w-full">
              <AnimatePresence mode="wait">
                {!uploading ? (
                  <motion.div 
                    key="dropzone"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
                  >
                    <div
                      {...getRootProps()}
                      className={`
                        group relative p-20 md:p-32 rounded-[70px] border-2 border-dashed transition-all cursor-pointer overflow-hidden
                        bg-[#0B1023] shadow-4xl transform-gpu hover:scale-[1.02]
                        ${isDragActive ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 hover:border-indigo-500/40"}
                      `}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center space-y-12 text-center text-white relative z-10">
                        <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl">
                          <FileUp className="w-12 h-12" />
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-3xl font-black italic uppercase tracking-tighter">Drop your CSV matrix here</h3>
                          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] leading-relaxed italic">
                            UTF-8 • ISO-8859 • MacRoman High Utility
                          </p>
                        </div>

                        <button className="px-12 py-5 bg-white text-black rounded-[24px] font-black uppercase text-[11px] tracking-widest hover:scale-110 active:scale-95 transition-all shadow-4xl italic">
                          Browse Local Files
                        </button>
                      </div>
                      
                      {/* Decorative corner icon */}
                      <div className="absolute bottom-8 right-8 text-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowDownLeft className="w-20 h-20" />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-20 md:p-32 rounded-[70px] bg-[#0B1023] border border-white/10 text-center space-y-16 shadow-4xl relative overflow-hidden"
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 blur-[80px] rounded-full animate-pulse" />
                    
                    <div className="relative inline-block">
                      <div className="w-32 h-32 rounded-full border-[14px] border-white/5 border-t-indigo-500 animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto w-12 h-12 text-indigo-400 animate-pulse" />
                    </div>
                    
                    <div className="space-y-8 relative z-10">
                      <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">{loadingMessage}</h3>
                      <div className="max-w-lg mx-auto space-y-6">
                        <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${uploadProgress}%` }} 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.8)]" 
                          />
                        </div>
                        <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.3em] italic">{uploadProgress}% SYNCED</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto pt-10">
              {[
                { label: "PowerBI Engine", desc: "Automated Suite" },
                { label: "Matrix Bias Scan", desc: "Fairness Audit" },
                { label: "Data Health Profiling", desc: "Integrity Checks" },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group cursor-default">
                  <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.4em] italic group-hover:text-white transition-colors">{feature.label}</p>
                  <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest leading-tight">{feature.desc}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── ERROR DISPLAY ── */}
      {error && (
          <div className="max-w-4xl w-full mx-auto p-12 text-center animate-in zoom-in-95 duration-500">
              <div className="p-16 rounded-[60px] bg-[#2D0A14] border border-rose-500/30 shadow-3xl shadow-rose-500/5">
                <CloudOff className="w-16 h-16 text-rose-500 mx-auto mb-10 group-hover:scale-110 transition-transform" />
                <h4 className="text-2xl font-black text-rose-500 uppercase tracking-tighter mb-4 italic">Protocol Ingestion Failure</h4>
                <p className="text-xs text-rose-200/50 font-bold leading-relaxed mb-10 uppercase italic tracking-tight">{error}</p>
                <button 
                  onClick={() => { setUploading(false); setError(null); }} 
                  className="px-12 py-5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all italic flex items-center gap-4 mx-auto"
                >
                  RETRY INGESTION <RefreshCw className="w-4 h-4" />
                </button>
              </div>
          </div>
      )}

      {/* ── LIVE REPORT CANVAS ── */}
      <AnimatePresence>
          {showReport && (
            <motion.section 
              initial={{ opacity: 0, y: 150 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-7xl mx-auto px-6 mt-32"
            >
              <div className="text-center mb-16 space-y-4">
                 <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Full Intelligence Canvas</h2>
                 <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] mt-2 italic flex items-center justify-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> BI Clusters Virtualized
                 </p>
              </div>
              
              <DashboardInsights />
            </motion.section>
          )}
      </AnimatePresence>

    </div>
  );
}
