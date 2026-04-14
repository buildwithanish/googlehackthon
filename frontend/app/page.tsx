"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Brain, FileDigit, BarChart3, ShieldCheck, Database, Zap, ArrowRight, 
  GitBranch, Play, TrendingUp, Star, ChevronRight, Activity, Lock, Search, 
  Eye, Layers, Settings, Users, MessageSquare, Network, Globe, Fingerprint, 
  Cpu, CheckCircle, Sparkles, MousePointer2, ShieldAlert, LayoutGrid, FileText
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

  // 20 powerful features requested
  const allFeatures = [
    { title: "Universal Ingestion", desc: "Multi-encoding CSV engine.", icon: <Database />, color: "bg-indigo-500" },
    { title: "Bias Auditing", desc: "Demographic parity audit.", icon: <ShieldAlert />, color: "bg-purple-500" },
    { title: "Gemini Intelligence", desc: "Natural language explanations.", icon: <Sparkles />, color: "bg-cyan-500" },
    { title: "XAI Visualize", desc: "Latent variable analysis.", icon: <Brain />, color: "bg-rose-500" },
    { title: "Demographic Parity", desc: "Equality of outcome auditor.", icon: <Users />, color: "bg-amber-500" },
    { title: "Disparate Impact", desc: "The 80% rule compliance check.", icon: <Activity />, color: "bg-emerald-500" },
    { title: "Equal Opportunity", desc: "Fairness in predictive modeling.", icon: <CheckCircle />, color: "bg-blue-500" },
    { title: "Themis Framework", desc: "Advanced bias testing suite.", icon: <ScaleIcon />, color: "bg-violet-500" },
    { title: "AIF360 Integration", desc: "IBM's open-source library core.", icon: <Layers />, color: "bg-slate-700" },
    { title: "Fair Learn", desc: "Optimizing for fairness constraints.", icon: <Zap />, color: "bg-yellow-500" },
    { title: "Data Profiler", desc: "Automatic schema & quality score.", icon: <LayoutGrid />, color: "bg-pink-500" },
    { title: "Quality Scoring", desc: "Integrity check for every row.", icon: <Fingerprint />, color: "bg-teal-500" },
    { title: "Outlier Detection", desc: "Identify anomalies in data.", icon: <Search />, color: "bg-orange-500" },
    { title: "Anomaly Map", desc: "Visual clusters of data spikes.", icon: <Network />, color: "bg-indigo-400" },
    { title: "PDF Reporting", desc: "Enterprise readiness documents.", icon: <FileText />, color: "bg-red-400" },
    { title: "PPT Export", desc: "Board-room ready presentations.", icon: <Play />, color: "bg-green-600" },
    { title: "Bias Simulation", desc: "Testing synthetic bias scenarios.", icon: <Cpu />, color: "bg-sky-500" },
    { title: "Mitigation Hub", desc: "Re-weighting & bias correction.", icon: <Settings />, color: "bg-slate-500" },
    { title: "Edge Processing", desc: "Client-side matrix extraction.", icon: <Globe />, color: "bg-lime-500" },
    { title: "Real-time Monitoring", desc: "Live audit of incoming signals.", icon: <Eye />, color: "bg-fuchsia-500" },
  ];

  return (
    <div className="flex flex-col w-full relative font-outfit">
      
      {/* ── HIGH-IMPACT HERO SECTION ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-12 shadow-2xl"
          >
            <Zap className="w-4 h-4 animate-bounce" /> Enterprise Data Intelligence Suite
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="text-7xl md:text-[11rem] font-black tracking-tighter leading-none mb-10 select-none"
          >
            <span className="bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent italic">FAIR</span>
            <span className="text-white italic">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-3xl font-black italic text-slate-400 max-w-4xl mx-auto leading-tight mb-16 uppercase tracking-tight"
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
              className="group relative px-12 py-6 bg-white text-black rounded-3xl font-black uppercase text-xs tracking-widest overflow-hidden transition-all hover:scale-110 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative flex items-center gap-3">
                <Database className="w-5 h-5" />
                Upload Repository
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <button
               onClick={() => router.push("/upload")}
              className="px-12 py-6 bg-white/5 border border-white/10 text-white rounded-3xl font-black uppercase text-xs tracking-widest backdrop-blur-xl hover:bg-white/10 transition-all hover:-translate-y-2 active:scale-95 flex items-center gap-3 shadow-xl"
            >
              <Play className="w-5 h-5 text-indigo-500" />
              Demo Instance
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── VIBRANT FEATURE GRID (20 Powerful Features) ── */}
      <section className="py-40 relative z-10 border-t border-white/5 bg-slate-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
             <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">Advanced Engine <br /> <span className="bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">Core Capabilities</span></h2>
             <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] italic">Proprietary Matrix Auditing Environment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {allFeatures.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10, rotate: 1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className="group p-8 rounded-[40px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all relative overflow-hidden h-full flex flex-col"
              >
                <div className={`w-10 h-10 ${f.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-white/5 group-hover:scale-110 transition-transform`}>
                  <div className="text-white scale-110">{f.icon}</div>
                </div>
                <h3 className="text-lg font-black italic uppercase text-white mb-2 leading-tight tracking-tighter">{f.title}</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed italic">{f.desc}</p>
                
                <div className="mt-8 flex items-center gap-2 text-[9px] font-black uppercase text-indigo-400 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  Deploy Hub <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISIONARY SECTION ── */}
      <section className="py-40 bg-indigo-600/[0.02] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col lg:flex-row items-center gap-20">
                  <div className="lg:w-1/2 space-y-10">
                      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl w-fit shadow-2xl">
                          <CheckCircle className="w-8 h-8 text-indigo-400" />
                      </div>
                      <h2 className="text-4xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] text-white">
                          Built for the <br /> <span className="text-indigo-500">Ethical Frontier</span>
                      </h2>
                      <p className="text-slate-400 text-lg font-black uppercase tracking-widest leading-relaxed italic">
                          FairAI isn't just a tool; it's a statement. By integrating IBM AIF360 and Google Gemini, we've created the most robust algorithmic audit engine ever deployed in a browser environment.
                      </p>
                      <div className="flex gap-16 pt-8">
                          <div>
                              <p className="text-5xl font-black text-white italic">100%</p>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">Open Source Core</p>
                          </div>
                          <div>
                              <p className="text-5xl font-black text-indigo-500 italic">v2.1</p>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">Neural Brain</p>
                          </div>
                      </div>
                  </div>
                  <div className="lg:w-1/2 grid grid-cols-2 gap-8 scale-95 md:scale-100">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`p-10 rounded-[50px] border border-white/5 bg-slate-900 shadow-3xl relative overflow-hidden ${i % 2 === 0 ? 'translate-y-12' : ''} group hover:border-indigo-500/20 transition-all`}>
                            <div className="w-2 h-2 rounded-full bg-indigo-500 absolute top-8 right-8 animate-pulse" />
                            <div className="space-y-6">
                                <Activity className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full bg-indigo-500 w-[${50 + (i*10)}%] shadow-[0_0_10px_rgba(99,102,241,0.5)]`} />
                                </div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Cluster Processing Node {i}</p>
                            </div>
                        </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-60 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[700px] bg-indigo-600/5 blur-[250px] rounded-full" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h3 className="text-6xl md:text-[9rem] font-black italic uppercase tracking-tighter text-white mb-16 leading-none">
                Start Your <br /> <span className="bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">AI Audit</span> Journey
            </h3>
            <Link href="/upload" className="inline-flex items-center gap-6 px-20 py-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[50px] font-black uppercase tracking-[0.2em] shadow-[0_20px_60px_rgba(79,70,229,0.5)] transition-all hover:scale-110 active:scale-95 text-sm">
                Launch Platform <ArrowRight className="w-8 h-8" />
            </Link>
        </div>
      </section>
    </div>
  );
}

function ScaleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h18" />
    </svg>
  );
}
