"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadDataset } from "@/lib/api";
import { UploadCloud, FileType, AlertCircle, Play, Database, Sparkles, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import DatasetViewer from "@/components/DatasetViewer";
import DashboardInsights from "@/components/DashboardInsights";

const DEMO_DATASETS = [

  {
    tag: "Financial Services",
    name: "sample_bias_dataset.csv",
    rows: 500, cols: 5,
    columns: ["gender", "age", "income", "education", "loan_approved"],
    sensitive: "gender",
    bias: "Gender Bias in Loan Approvals",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/5 border-violet-500/20",
    tagColor: "bg-violet-500/10 text-violet-400",
    description: "Pre-built dataset showing significant gender disparity in loan decisions. Perfect for demo.",
  },
  {
    tag: "HR & Recruitment",
    name: "hiring_dataset.csv",
    rows: 500, cols: 6,
    columns: ["gender", "age", "experience", "education", "salary", "hired"],
    sensitive: "gender",
    bias: "Age & Gender Bias in Hiring",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/5 border-blue-500/20",
    tagColor: "bg-blue-500/10 text-blue-400",
    description: "Simulates discriminatory patterns in resume screening and job selection.",
  },
  {
    tag: "Healthcare",
    name: "healthcare_dataset.csv",
    rows: 500, cols: 6,
    columns: ["gender", "age", "income", "diagnosis", "treatment", "outcome"],
    sensitive: "gender",
    bias: "Demographic Treatment Disparities",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/5 border-emerald-500/20",
    tagColor: "bg-emerald-500/10 text-emerald-400",
    description: "Shows unequal medical treatment outcomes based on patient demographics.",
  },
];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLoading(true);
      setError("");
      setPreview(null);
      setShowInsights(false);
      try {
        const data = await uploadDataset(selectedFile);
        
        if (data.error) {
           setError(data.error);
           setPreview(null);
           return;
        }

        setPreview(data);
        localStorage.setItem("dataset_info", JSON.stringify(data));
        localStorage.removeItem("demo_mode");
        // We will pass the ACTUAL file to the next step via localStorage or a global state
        // For now, we'll store the object and handle the file upload during analysis
      } catch (err: any) {
        console.error("API Error:", err);
        const actualError = err.response?.data?.detail || err.message || "Unknown error";
        setError(`Processing failed: ${actualError}`);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
  });

  const runDemo = (demo: typeof DEMO_DATASETS[0]) => {
    localStorage.setItem("dataset_info", JSON.stringify({
      filename: demo.name,
      shape: { rows: demo.rows, cols: demo.cols },
      columns: demo.columns,
      sensitive_column_hints: [demo.sensitive],
      preview: [],
    }));
    localStorage.setItem("demo_mode", demo.name);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Header */}
      <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm px-4 py-1.5 rounded-full font-semibold mb-4">
              <Database className="w-4 h-4" />
              Bias Detection Pipeline
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Dataset Center</h1>
            <p className="mt-3 text-slate-400 text-lg max-w-xl font-medium">
              Upload your CSV to perform a full fairness audit. Secure, private, and automated.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        {/* Drop Zone */}
        {!preview && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div
                    {...getRootProps()}
                    className={`relative border-2 border-dashed rounded-3xl p-20 text-center cursor-pointer transition-all ${
                    isDragActive
                        ? "border-indigo-500 bg-indigo-500/5 shadow-2xl shadow-indigo-500/10 scale-[1.01]"
                        : "border-white/10 bg-white/[0.02] hover:border-indigo-500/50 hover:bg-indigo-500/[0.03]"
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className={`inline-flex p-6 rounded-2xl mb-6 transition-all ${isDragActive ? "bg-indigo-500/20" : "bg-white/5"}`}>
                    <UploadCloud className={`h-12 w-12 transition-colors ${isDragActive ? "text-indigo-400" : "text-slate-500"}`} />
                    </div>
                    <h2 className="text-3xl font-black text-white">
                    {isDragActive ? "Drop CSV Now" : "Drag & Drop CSV"}
                    </h2>
                    <p className="mt-3 text-slate-500 text-lg">or click to browse your cloud storage or local disk</p>
                    <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest">
                        <Sparkles className="w-4 h-4" />
                        Select Dataset
                    </div>
                    <p className="mt-6 text-xs text-slate-600 font-bold uppercase tracking-wider">CSV format · Max 50MB · Encrypted Transfer</p>
                </div>

                {/* Loading / Error States */}
                <AnimatePresence mode="wait">
                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12 mt-8">
                      <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-indigo-400 font-black uppercase tracking-widest text-xs">Analyzing & Profiling Data...</p>
                    </motion.div>
                  )}

                  {error && !loading && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-8 rounded-3xl bg-rose-500/5 border border-rose-500/20 text-rose-300 shadow-2xl shadow-rose-500/10">
                      <div className="flex items-start gap-4">
                        <div className="p-4 bg-rose-500/20 rounded-2xl">
                            <AlertCircle className="w-8 h-8 text-rose-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-black text-white tracking-tight">Dataset Processing Error</h3>
                            <p className="text-rose-400/80 mt-2 text-lg font-medium">{error}</p>
                            <p className="mt-4 text-sm text-slate-500">Ensure the CSV is properly formatted and does not contain unsupported characters.</p>
                            <div className="mt-8 flex items-center gap-3">
                                <button onClick={() => { setError(""); setFile(null); }} className="px-6 py-3 bg-rose-500 text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-rose-500/20 uppercase tracking-widest">
                                    Try Another File
                                </button>
                            </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Demo Mode Section */}
                <div className="mt-12 relative rounded-3xl border border-white/5 bg-white/[0.02] px-8 py-10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-1.5 rounded-full font-semibold mb-5">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        Demo Mode — No Upload Required
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">Try Live Demo Datasets</h2>
                    <p className="text-slate-400 mb-8 max-w-xl font-medium">
                        Select a pre-built dataset with intentional biases to see how FairAI identifies systemic risks.
                    </p>

                    <div className="grid md:grid-cols-3 gap-5">
                        {DEMO_DATASETS.map((demo, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => runDemo(demo)}
                            className={`group relative overflow-hidden p-6 rounded-2xl border ${demo.bgColor} cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${demo.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                            <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4 ${demo.tagColor}`}>
                            {demo.tag}
                            </span>
                            <h3 className="text-lg font-black text-white mb-1 tracking-tight">{demo.name}</h3>
                            <p className="text-sm text-slate-500 mb-1">{demo.rows} rows · {demo.cols} columns</p>
                            <p className="text-xs text-slate-600 mb-5 font-medium">{demo.description}</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${demo.tagColor}`}>⚠ {demo.bias}</span>
                            </div>
                            <button className={`mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r ${demo.color} text-white opacity-80 group-hover:opacity-100 transition-all shadow-lg uppercase tracking-widest`}>
                            <Play className="w-3 h-3" />
                            Launch Demo
                            </button>
                        </motion.div>
                        ))}
                    </div>
                    </div>
                </div>
            </motion.div>
        )}

        {/* Excel-Style Preview */}
        <AnimatePresence>
          {preview && !loading && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                     <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase text-xs tracking-widest mb-2">
                        <FileType className="w-4 h-4" />
                        Dataset Profile Ready
                     </div>
                     <h2 className="text-4xl font-black text-white tracking-tight">{preview.filename}</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                         onClick={() => { setPreview(null); setFile(null); }}
                         className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-sm transition-all"
                    >
                        Change File
                    </button>
                    {!showInsights && (
                        <button
                            onClick={() => setShowInsights(true)}
                            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Run Bias Analysis
                        </button>
                    )}
                </div>
              </div>

              {/* Grid Component */}
              <DatasetViewer 
                data={preview.preview} 
                columns={preview.columns} 
                stats={preview.stats} 
              />
              
              {/* Display Results directly below */}
              {showInsights && (
                  <DashboardInsights />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
