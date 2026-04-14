"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain, FileDigit, BarChart3, ShieldCheck, Database, Zap, ArrowRight,
  GitBranch, Play, TrendingUp, Star, ChevronRight, Activity, Lock, Search, 
  Eye, Layers, Settings, Users, MessageSquare, Network, Globe, Fingerprint, 
  Cpu, CheckCircle, Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay, duration: 0.6, ease: "easeOut" as const },
  };
}

export default function LandingPage() {
  const router = useRouter();

  const features = [
    { id: 1, icon: <Database className="w-6 h-6" />, title: "Smart Dataset Profiling", desc: "Auto-detect sensitive columns, missing values, and data distributions.", color: "from-blue-500 to-cyan-500" },
    { id: 2, icon: <BarChart3 className="w-6 h-6" />, title: "5 Fairness Metrics", desc: "Demographic Parity, Equal Opportunity, Disparate Impact, and more.", color: "from-violet-500 to-purple-500" },
    { id: 3, icon: <Brain className="w-6 h-6" />, title: "Gemini AI Explanation", desc: "Google Gemini generates plain-language bias explanations.", color: "from-pink-500 to-rose-500" },
    { id: 4, icon: <ShieldCheck className="w-6 h-6" />, title: "80% Rule Compliance", desc: "Checks Disparate Impact against legal standards instantly.", color: "from-emerald-500 to-green-500" },
    { id: 5, icon: <TrendingUp className="w-6 h-6" />, title: "Visual Dashboard", desc: "Real-time interactive charts powered by Recharts.", color: "from-orange-500 to-amber-500" },
    { id: 6, icon: <FileDigit className="w-6 h-6" />, title: "PDF Bias Report", desc: "Export professional compliance audits with one click.", color: "from-indigo-500 to-blue-500" },
    { id: 7, icon: <Zap className="w-6 h-6" />, title: "Explainable AI (XAI)", desc: "Interactive SHAP charts explaining model decisions.", color: "from-yellow-500 to-orange-500" },
    { id: 8, icon: <Activity className="w-6 h-6" />, title: "Real-Time Mitigation", desc: "Actionable steps to eliminate algorithmic bias.", color: "from-teal-500 to-emerald-500" }
  ];

  return (
    <div className="flex flex-col w-full overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-32">
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <motion.div
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-10 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            Empowering Fair Algorithms · Synapse Squad Hub
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-8"
          >
            <span className="bg-gradient-to-r from-white via-indigo-100 to-slate-400 bg-clip-text text-transparent">
              Fair
            </span>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="text-xl md:text-3xl font-black italic text-slate-400 max-w-4xl mx-auto leading-tight mb-12 uppercase tracking-tight"
          >
            Universal Data Intelligence & <br className="hidden md:block" />
            <span className="text-white">Fairness Audit Platform</span>
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="/upload"
              className="group flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl hover:shadow-white/20 transition-all hover:-translate-y-1"
            >
              <Database className="w-5 h-5" />
              Upload Dataset
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => {
                localStorage.setItem("dataset_info", JSON.stringify({
                  filename: "enterprise_audit_log.csv",
                  stats: { rows: 1250, cols: 12 },
                  target_column: "approved",
                  sensitive_column_hints: ["gender"]
                }));
                router.push("/dashboard");
              }}
              className="group flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-sm tracking-widest backdrop-blur-xl hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              <Play className="w-5 h-5 text-indigo-500" />
              Run Demo Analysis
            </button>
          </motion.div>

          {/* KPI Mini-Grid */}
          <motion.div
            {...fadeUp(0.4)}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { val: "Auto-BI", label: "Reporting" },
              { val: "XAI", label: "Interpretability" },
              { val: "Gemini", label: "AI Oracle" },
              { val: "Compliance", label: "80% Rule" },
            ].map((s, i) => (
              <div key={i} className="text-center p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="text-2xl font-black italic text-white leading-none">{s.val}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp(0)} className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-4">
              Premium Intelligence Features
            </h2>
            <p className="text-slate-500 text-sm font-black uppercase tracking-[0.3em]">
              The Gold Standard for Algorithmic Transparency
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.05)}
                className="group p-10 rounded-[40px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/20 transition-all cursor-crosshair relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600/20 transition-colors">
                        {f.icon}
                    </div>
                    <h3 className="text-xl font-black italic uppercase text-white mb-4">{f.title}</h3>
                    <p className="text-slate-500 text-xs font-bold leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM SECTION ── */}
      <section id="about" className="py-32 bg-indigo-600/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h2 {...fadeUp(0)} className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-20 text-white">
                Engineered by <br className="md:hidden" /> <span className="text-indigo-500">Synapse Squad Hub</span>
            </motion.h2>

            <div className="flex flex-wrap justify-center gap-10">
              {[
                { name: "Anish Raj", role: "AI Lead", initial: "A" },
                { name: "Amrit Anand", role: "UI Architect", initial: "A" },
                { name: "Subham Sharma", role: "Data Engineer", initial: "S" },
                { name: "Kapil Vishwakarma", role: "QA Lead", initial: "K" }
              ].map((member, i) => (
                <motion.div 
                  key={i} 
                  {...fadeUp(i * 0.1)}
                  className="p-10 rounded-[50px] border border-white/5 bg-white/[0.01] hover:bg-[#0b1020] transition-all w-64 text-center group"
                >
                  <div className="w-20 h-20 bg-indigo-600 rounded-[30px] flex items-center justify-center text-3xl font-black text-white mx-auto mb-8 shadow-2xl shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                    {member.initial}
                  </div>
                  <h3 className="text-xl font-black italic text-white uppercase mb-2">{member.name}</h3>
                  <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{member.role}</p>
                </motion.div>
              ))}
            </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-40 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
            <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-10">
                Ready for <span className="text-indigo-400">Algorithmic Clarity?</span>
            </h3>
            <Link href="/upload" className="inline-flex items-center gap-4 px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[30px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 transition-all hover:scale-105">
                Launch Platform Now <ArrowRight className="w-6 h-6" />
            </Link>
        </div>
      </section>
    </div>
  );
}
