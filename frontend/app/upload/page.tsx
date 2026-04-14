"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, Database, ShieldAlert, Sparkles, AlertCircle, 
  CheckCircle2, ArrowRight, Table as TableIcon, Activity,
  RefreshCw, CloudOff, Info, Layers, Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadDataset, pingHealth } from "@/lib/api";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpload = async (selectedFile: File) => {
    setUploading(true);
    setUploadProgress(0);
    setError(null);
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
        setLoadingMessage("Dataset Secured. Launching BI Dashboard...");
        
        localStorage.setItem("dataset_info", JSON.stringify({
          file_id: res.file_id,
          filename: selectedFile.name,
          stats: res.stats,
          target_column: res.target_column || "none",
          sensitive_column_hints: res.sensitive_column_hints || ["none"]
        }));

        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
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
    <section className="min-h-screen relative flex flex-col items-center justify-center px-6 py-20 overflow-hidden font-outfit">
      
      {/* ── PREMIUM BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl w-full space-y-16 relative z-10">
        
        {/* ── HERO TITLE ── */}
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2"
          >
            <Sparkles className="w-3.5 h-3.5" /> Premium AI Architecture
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-center">
            Ingest Your <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Universal Dataset
            </span>
          </h1>
          
          <p className="text-slate-500 text-sm md:text-base font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto italic text-center">
            Autonomous Bias Detection • High-Fidelity Matrix Analysis
          </p>
        </div>

        {/* ── UPLOAD CARD ── */}
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
                      shadow-2xl shadow-indigo-500/5 bg-[#0b1020]/50 backdrop-blur-xl
                      ${isDragActive ? "border-indigo-500 bg-indigo-500/10" : "border-purple-500/20 hover:border-indigo-400/40 hover:bg-white/[0.02]"}
                    `}
                  >
                    <input {...getInputProps()} />
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex flex-col items-center space-y-8 text-center">
                      <div className="p-8 bg-indigo-500/10 rounded-[40px] group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-500">
                        <FileUp className="w-12 h-12 text-indigo-400" />
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-2xl font-black italic uppercase tracking-tight">Drop your CSV here</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] leading-relaxed">
                          UTF-8 • Latin1 • ISO Encodings Supported<br/>
                          <span className="text-slate-400">Standardizing Matrix extraction logic...</span>
                        </p>
                      </div>

                      <button className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-[0.1em] hover:bg-indigo-50 hover:shadow-2xl hover:shadow-white/20 transition-all">
                        Browse Repository
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-16 md:p-24 rounded-[60px] bg-[#0b1020] border border-white/5 text-center space-y-12 shadow-[0_0_100px_rgba(99,102,241,0.1)] relative overflow-hidden"
                >
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
                  
                  <div className="relative inline-block">
                    <div className="w-28 h-28 rounded-full border-[12px] border-indigo-500/5 border-t-indigo-500 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-indigo-400 animate-pulse" />
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">{loadingMessage}</h3>
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${uploadProgress}%` }} 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)]" 
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] italic">
                        <span>Core Link Established</span>
                        <span>{uploadProgress}% Extracted</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                     {["Neural Sync", "Delimiter Logic", "Encoding Fallback", "Matrix Audit"].map((t, i) => (
                        <span key={i} className="px-4 py-1.5 bg-indigo-500/10 rounded-xl text-[8px] font-black uppercase text-indigo-300 border border-indigo-500/20 italic">
                          {t}
                        </span>
                     ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>

        {/* ── ERROR DISPLAY ── */}
        {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto p-8 rounded-[40px] bg-rose-500/5 border border-rose-500/20 flex items-start gap-6 backdrop-blur-md">
               <div className="p-3 bg-rose-500/20 rounded-2xl"><CloudOff className="w-6 h-6 text-rose-500" /></div>
               <div className="flex-1">
                  <h4 className="text-sm font-black text-rose-500 uppercase tracking-widest mb-1 italic">Ingestion Cluster Failure</h4>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">{error}</p>
                  <button onClick={() => { setUploading(false); setError(null); }} className="mt-4 px-6 py-2 bg-rose-500 hover:bg-rose-400 text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-lg shadow-rose-500/20">Manual Reset</button>
               </div>
            </motion.div>
        )}

        {/* ── FEATURE INDICATORS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: <Database className="w-5 h-5" />, label: "Grid Profiling", desc: "Automated schema scan" },
              { icon: <ShieldAlert className="w-5 h-5" />, label: "Bias Audit", desc: "Fairness matrix scoring" },
              { icon: <Activity className="w-5 h-5" />, label: "Quality Score", desc: "Dataset health validation" },
            ].map((feature, i) => (
              <div key={i} className="group flex items-center gap-5 p-6 rounded-[35px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all hover:-translate-y-1">
                <div className="p-3.5 bg-indigo-600/10 rounded-2xl group-hover:bg-indigo-600/20 transition-colors text-indigo-400">{feature.icon}</div>
                <div>
                  <p className="text-[11px] font-black uppercase text-white tracking-widest italic">{feature.label}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 italic leading-tight">{feature.desc}</p>
                </div>
              </div>
            ))}
        </div>

      </div>
    </section>
  );
}
