"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, Database, ShieldAlert, Sparkles, AlertCircle, 
  CheckCircle2, ArrowRight, Table as TableIcon, Activity,
  RefreshCw, CloudOff, Info, Layers, Zap, LayoutGrid
} from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadDataset, pingHealth, analyzeBias } from "@/lib/api";
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

        // Instead of redirecting, we show the report below
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
    <div className="min-h-screen flex flex-col items-center bg-slate-950 font-outfit pb-32">
      
      {/* ── ORIGINAL UPLOAD SECTION ── */}
      <section className="w-full relative flex flex-col items-center justify-center px-6 py-24 overflow-hidden border-b border-white/5 bg-slate-900/40 backdrop-blur-xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl w-full space-y-16 relative z-10 text-center">
          
          {/* HERO TITLE: Exact string requested */}
          <div className="space-y-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2"
            >
              <Zap className="w-3.5 h-3.5" /> High-Performance AI Logic
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">
              Ingest Your <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Universal Dataset</span>
            </h1>
            
            <p className="text-slate-500 text-sm md:text-base font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto italic">
              Autonomous Bias Detection • High-Fidelity Matrix Analysis
            </p>
          </div>

          {/* UPLOAD CARD: Exact design requested */}
          <div className="max-w-3xl mx-auto w-full">
              <AnimatePresence mode="wait">
                {!uploading ? (
                  <motion.div 
                    key="dropzone"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div
                      {...getRootProps()}
                      className={`
                        group relative p-12 md:p-20 rounded-[50px] border-2 border-dashed transition-all cursor-pointer overflow-hidden
                        shadow-2xl shadow-indigo-500/10 bg-slate-900/50 backdrop-blur-2xl
                        ${isDragActive ? "border-indigo-500 bg-indigo-500/15" : "border-indigo-500/20 hover:border-indigo-500/50 hover:bg-white/[0.02]"}
                      `}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center space-y-8 text-center text-white">
                        <div className="p-8 bg-indigo-500/20 rounded-[40px] group-hover:bg-indigo-500/40 group-hover:scale-110 transition-all duration-500">
                          <FileUp className="w-12 h-12 text-indigo-400" />
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-2xl font-black italic uppercase tracking-tight">Drag & Drop CSV</h3>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] leading-relaxed">
                            UTF-8 • Latin1 • ISO Encodings Supported
                          </p>
                        </div>

                        <button className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">
                          Browse Files
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-16 md:p-24 rounded-[60px] bg-slate-900 border border-white/5 text-center space-y-12 shadow-[0_0_100px_rgba(99,102,241,0.1)] relative overflow-hidden"
                  >
                    <div className="relative inline-block">
                      <div className="w-24 h-24 rounded-full border-[10px] border-indigo-500/10 border-t-indigo-500 animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-indigo-400 animate-pulse" />
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">{loadingMessage}</h3>
                      <div className="max-w-md mx-auto space-y-4">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${uploadProgress}%` }} 
                            className="h-full bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)]" 
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{uploadProgress}% Processed</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>

          {/* FEATURE INDICATORS: Exact string requested */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-10">
              {[
                { label: "PowerBI Reporting", desc: "Automated analytics suite" },
                { label: "Bias Scoring", desc: "Fairness matrix audit" },
                { label: "Integrity Score", desc: "Dataset health check" },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <p className="text-xs font-black uppercase text-indigo-400 tracking-widest italic">{feature.label}</p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-tight">{feature.desc}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── ERROR DISPLAY ── */}
      {error && (
          <div className="max-w-3xl w-full mx-auto p-12 text-center">
              <div className="p-8 rounded-[40px] bg-rose-500/5 border border-rose-500/20">
                <CloudOff className="w-12 h-12 text-rose-500 mx-auto mb-6" />
                <h4 className="text-lg font-black text-rose-500 uppercase tracking-widest mb-2 italic">Ingestion Failure</h4>
                <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6">{error}</p>
                <button onClick={() => { setUploading(false); setError(null); }} className="px-8 py-3 bg-rose-500 text-white text-[10px] font-black uppercase rounded-xl transition-all">Retry Link</button>
              </div>
          </div>
      )}

      {/* ── REPORT SECTION: Renders below upload ── */}
      <AnimatePresence>
          {showReport && (
            <motion.section 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-7xl mx-auto px-6 mt-12"
            >
              <div className="text-center mb-12">
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">PowerBI Analytics Dashboard</h2>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 italic flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Automated Intelligence Active
                 </p>
              </div>
              
              {/* This component handles KPI, Charts, AI Insights, Metrics */}
              <DashboardInsights />
            </motion.section>
          )}
      </AnimatePresence>

    </div>
  );
}
