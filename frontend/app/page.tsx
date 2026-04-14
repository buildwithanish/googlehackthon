"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain, FileDigit, BarChart3, ShieldCheck, Database, Zap, ArrowRight,
  GitBranch, Play, TrendingUp, Star, ChevronRight, Activity, Lock, Search, 
  Eye, Layers, Settings, Users, MessageSquare, Network, Globe, Fingerprint, 
  Cpu, CheckCircle, Sparkles, MousePointer2, ShieldAlert
} from "lucide-react";
import { useRouter } from "next/navigation";

// Variants for coordinated animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function LandingPage() {
  const router = useRouter();

  const primaryFeatures = [
    { title: "Universal Ingestion", desc: "Multi-encoding CSV engine with auto-delimiter sensing.", icon: <Database className="w-5 h-5" />, color: "bg-indigo-500" },
    { title: "Bias Auditing", desc: "Demographic parity & Disparate impact compliance audit.", icon: <ShieldAlert className="w-5 h-5" />, color: "bg-purple-500" },
    { title: "Gemini Intelligence", desc: "Plain-language bias explanations powered by Google.", icon: <Sparkles className="w-5 h-5" />, color: "bg-cyan-500" },
    { title: "XAI Visualize", desc: "Latent variable importance via feature weight analysis.", icon: <Brain className="w-5 h-5" />, color: "bg-rose-500" }
  ];

  return (
    <div className="flex flex-col w-full relative">
      
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse delay-1000" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-12"
          >
            <Zap className="w-4 h-4 animate-bounce" /> Enterprise Data Intelligence Suite
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none mb-10 select-none"
          >
            <span className="bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">FAIR</span>
            <span className="text-white">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-3xl font-black italic text-slate-400 max-w-3xl mx-auto leading-tight mb-16 uppercase tracking-tight"
          >
            The Gold Standard for <span className="text-white">Algorithmic Integrity</span> & <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Automatic Data Intelligence</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="/upload"
              className="group relative px-12 py-6 bg-white text-black rounded-3xl font-black uppercase text-sm tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative flex items-center gap-3">
                <Database className="w-5 h-5" />
                Upload Repository
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <button
               onClick={() => {
                localStorage.setItem("dataset_info", JSON.stringify({
                  filename: "global_bias_audit_v4.csv",
                  stats: { rows: 25000, cols: 24, quality: 98 },
                  target_column: "Decision",
                  sensitive_column_hints: ["Race", "Gender"]
                }));
                router.push("/dashboard");
              }}
              className="px-12 py-6 bg-white/5 border border-white/10 text-white rounded-3xl font-black uppercase text-sm tracking-widest backdrop-blur-xl hover:bg-white/10 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
            >
              <Play className="w-5 h-5 text-indigo-500" />
              Demo Instance
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── INTERACTIVE GRID (Old Design Vibes) ── */}
      <section className="py-32 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {primaryFeatures.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group p-10 rounded-[50px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all relative overflow-hidden h-full flex flex-col justify-between"
              >
                <div className={`absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity`}>
                   <div className="scale-[3]">{f.icon}</div>
                </div>
                <div>
                  <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-white/5`}>
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-black italic uppercase text-white mb-4 leading-none tracking-tighter">{f.title}</h3>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest leading-relaxed italic">{f.desc}</p>
                </div>
                <div className="mt-12 flex items-center gap-2 text-[10px] font-black uppercase text-indigo-400 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  Deploy Feature <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISIONARY SECTION ── */}
      <section className="py-40 bg-indigo-600/[0.01] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col lg:flex-row items-center gap-20">
                  <div className="lg:w-1/2 space-y-10">
                      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl w-fit">
                          <CheckCircle className="w-8 h-8 text-indigo-400" />
                      </div>
                      <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] text-white">
                          Built for the <br /> <span className="text-indigo-500">Ethical Frontier</span>
                      </h2>
                      <p className="text-slate-400 text-lg font-bold uppercase tracking-widest leading-relaxed">
                          FairAI isn't just a tool; it's a statement. By integrating Google Gemini and IBM AIF360, we've created the most robust algorithmic audit engine on the market.
                      </p>
                      <div className="flex gap-10">
                          <div>
                              <p className="text-3xl font-black text-white">100%</p>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Open Source Core</p>
                          </div>
                          <div>
                              <p className="text-3xl font-black text-white">Gemini 1.5</p>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Neural Brain</p>
                          </div>
                      </div>
                  </div>
                  <div className="lg:w-1/2 grid grid-cols-2 gap-6 scale-95 md:scale-100">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`p-8 rounded-[40px] border border-white/5 bg-slate-900 shadow-2xl relative overflow-hidden ${i % 2 === 0 ? 'translate-y-10' : ''}`}>
                            <div className="w-2 h-2 rounded-full bg-indigo-500 absolute top-6 right-6 animate-pulse" />
                            <div className="space-y-4">
                                <Activity className="w-6 h-6 text-slate-500" />
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[70%]" />
                                </div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Processing Node {i}</p>
                            </div>
                        </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-60 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-indigo-600/5 blur-[200px] rounded-full" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h3 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white mb-12 leading-none">
                Start Your <br /> <span className="bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">AI Audit</span> Journey
            </h3>
            <Link href="/upload" className="inline-flex items-center gap-4 px-16 py-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[40px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/50 transition-all hover:scale-110 active:scale-95">
                Launch Platform <ArrowRight className="w-8 h-8" />
            </Link>
        </div>
      </section>
    </div>
  );
}
