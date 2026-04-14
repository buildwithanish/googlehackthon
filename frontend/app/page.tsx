"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Brain, FileDigit, BarChart3, ShieldCheck, Database, Zap, 
  ArrowRight, Play, CheckCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-slate-950 min-h-screen text-white flex flex-col items-center">
      
      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-48 w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-60 left-20 w-72 h-72 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 backdrop-blur-sm"
          >
            <SparklesIcon /> Google Solution Challenge 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-8"
          >
            Universal <span className="text-indigo-500 italic">Data Intelligence</span> & <br /> Bias Audit Engine
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl font-bold text-slate-400 max-w-4xl mx-auto leading-relaxed mb-12 uppercase tracking-tight italic"
          >
            Ensuring <span className="text-white">mathematical fairness</span> across enterprise AI ecosystems. Powering the next generation of ethical algorithmic governance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="/upload"
              className="group flex items-center gap-3 px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              Start Analysis <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              onClick={() => router.push("/upload")}
              className="flex items-center gap-3 px-12 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
            >
              <Play className="w-4 h-4 text-indigo-500" /> Run Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── CORE FEATURES GRID ── */}
      <section className="py-32 w-full max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Smart Profiling", desc: "Automated schema detection & quality scoring.", icon: <Database /> },
              { title: "Bias Auditing", desc: "Fairness metrics aligned with legal standards.", icon: <ShieldCheck /> },
              { title: "AI Explainability", desc: "Natural language insights via Google Gemini.", icon: <Brain /> }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[40px] border border-white/5 bg-slate-900 shadow-xl group hover:border-indigo-500/30 transition-all">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {feature.icon}
                  </div>
                  <h3 className="text-xl font-black italic uppercase text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-500 text-xs font-bold leading-relaxed">{feature.desc}</p>
              </div>
            ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-40 text-center w-full bg-slate-900/40 border-y border-white/5 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
        <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-10 relative z-10">
          Ready to Audit Your <br /> <span className="text-indigo-500">AI Ecosystem?</span>
        </h3>
        <Link href="/upload" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all relative z-10">
          Get Started Now <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

    </div>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}
