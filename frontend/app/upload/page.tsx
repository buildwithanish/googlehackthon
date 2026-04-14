"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, Database, ShieldAlert, Sparkles, AlertCircle, 
  CheckCircle2, ArrowRight, Table as TableIcon, Activity,
  RefreshCw, CloudOff
} from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadDataset, pingHealth } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      // Step 2: Wake up backend before upload (Render Sleep Mitigation)
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
          throw new Error("AI Engine is currently unavailable. The server might be experiencing high load. Please try again in a few minutes.");
      }

      // Step 3: Start real upload
      setLoadingMessage("Scanning Dataset Integrity...");
      setUploadProgress(40);
      const res = await uploadDataset(selectedFile);
      
      if (res.success) {
        setUploadProgress(100);
        setLoadingMessage("Dataset Secured. Launching BI Dashboard...");
        
        // Save dataset info for persistent state
        localStorage.setItem("dataset_info", JSON.stringify({
          file_id: res.file_id,
          filename: selectedFile.name,
          stats: res.stats,
          target_column: res.target_column || "none",
          sensitive_column_hints: res.sensitive_column_hints || ["none"]
        }));

        // Experience delay to transition smoothly
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        throw new Error(res.error || "Dataset ingestion failed.");
      }
    } catch (err: any) {
      console.error("[FairAI] Upload Crash:", err);
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-outfit">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px]" />

        <div className="max-w-2xl w-full space-y-12 relative z-10">
          <div className="text-center space-y-4">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 mb-4">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tight">
              Ingest Your <span className="text-indigo-500">Universal Dataset</span>
            </h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
              AI-Powered Bias Detection • Auto-Generated Architecture
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!uploading ? (
              <motion.div 
                key="dropzone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div
                  {...getRootProps()} 
                  className={`
                    p-16 rounded-[50px] border-2 border-dashed transition-all cursor-pointer group relative overflow-hidden
                    ${isDragActive ? "border-indigo-500 bg-indigo-500/5 shadow-2xl" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"}
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="p-6 bg-white/5 rounded-[30px] group-hover:bg-indigo-500/10 transition-colors">
                      <FileUp className="w-10 h-10 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black italic mb-2">Drop your CSV here</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                        Supports Universal UTF-8, Latin1, and ISO Encodings<br/>Max File Size: 100MB
                      </p>
                    </div>
                    <button className="px-8 py-3 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all shadow-xl">
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
                className="p-16 rounded-[50px] bg-slate-900 border border-white/5 text-center space-y-10 shadow-2xl"
              >
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full border-[10px] border-indigo-500/10 border-t-indigo-500 animate-spin" />
                  <div className="absolute inset-0 m-auto w-10 h-10 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-black italic text-white uppercase">{loadingMessage}</h3>
                  <div className="max-w-xs mx-auto space-y-3">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      Task Process: {uploadProgress}% Completed
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex flex-wrap justify-center gap-3">
                   {["Neural Sync", "Delimiter Logic", "Encoding Fallback"].map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase text-slate-400 border border-white/5 italic">
                        {t}
                      </span>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-4">
               <CloudOff className="w-5 h-5 text-rose-500 mt-1 shrink-0" />
               <div>
                  <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-1">Architecture Blocker</h4>
                  <p className="text-sm text-slate-400 font-medium">{error}</p>
                  <button onClick={() => { setUploading(false); setError(null); }} className="mt-4 text-[10px] font-black uppercase text-white hover:text-indigo-400 transition-colors">Try Manual Reset</button>
               </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity">
            {[
              { icon: <Database className="w-4 h-4" />, label: "PowerBI Reporting", desc: "Automated visualization" },
              { icon: <ShieldAlert className="w-4 h-4" />, label: "Bias Scoring", desc: "Fairness matrix audit" },
              { icon: <Activity className="w-4 h-4" />, label: "Integrity Score", desc: "Quality health check" },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="p-2.5 bg-white/5 rounded-xl h-fit">{feature.icon}</div>
                <div>
                  <p className="text-[9px] font-black uppercase text-white tracking-tight">{feature.label}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase italic">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
