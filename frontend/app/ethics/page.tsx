"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Heart, Scale, Users, FileText, Lock, Globe, Sparkles } from "lucide-react";
import Link from "next/link";

export default function EthicsPage() {
  const principles = [
    {
      title: "Transparency First",
      desc: "Every bias detection score is accompanied by a Gemini-powered explanation. We don't believe in black-box governance.",
      icon: <Globe className="w-6 h-6 text-indigo-400" />,
    },
    {
      title: "Universal Fairness",
      desc: "Our algorithms (Fairlearn & AIF360) are designed to detect disparities across all protected classes: Gender, Race, Age, and more.",
      icon: <Scale className="w-6 h-6 text-indigo-400" />,
    },
    {
      title: "Data Sovereignty",
      desc: "FairAI never stores your datasets. Analysis is performed in-memory or on-premise, ensuring complete privacy and compliance.",
      icon: <Lock className="w-6 h-6 text-indigo-400" />,
    },
    {
      title: "Human-in-the-Loop",
      desc: "AI identifies the bias, but our remediation roadmaps empower human engineers to make the final decision.",
      icon: <Users className="w-6 h-6 text-indigo-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <nav className="border-b border-white/5 bg-slate-900/40 backdrop-blur-xl p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-black italic tracking-tighter hover:text-indigo-400 transition-colors">FAIRAI</Link>
            <Link href="/dashboard" className="px-6 py-2 bg-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:bg-indigo-500">Back to Mission</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-24">
        <header className="text-center mb-24">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex p-3 bg-indigo-500/10 rounded-2xl mb-6">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </motion.div>
          <h1 className="text-6xl font-black italic mb-6 bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">AI ETHICS CHARTER</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            At Synapse Squad Hub, we believe that AI should be a tool for equity, not a mirror for historical prejudice.
            This charter defines our commitment to Building Unbiased Intelligence.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-8 mb-32">
          {principles.map((p, i) => (
            <motion.div 
               key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
               className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
            >
              <div className="p-4 bg-indigo-500/10 rounded-2xl w-fit mb-6 group-hover:bg-indigo-500/20 transition-all">
                {p.icon}
              </div>
              <h3 className="text-xl font-black mb-3 italic tracking-tight">{p.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{p.desc}</p>
            </motion.div>
          ))}
        </section>

        <section className="p-12 rounded-[50px] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 relative overflow-hidden">
            <div className="relative z-10 text-center">
                <h2 className="text-3xl font-black italic mb-6">THE ANTIGRAVITY COMMITMENT</h2>
                <p className="text-indigo-200/70 text-lg mb-10 leading-relaxed font-medium max-w-3xl mx-auto">
                    "We pledge to never deploy a model into production that hasn't cleared a 80% Fairness Score or been audited by FairAI 
                    for intersectional systemic bias. Our code is built on the foundation of mathematical equity."
                </p>
                <div className="flex justify-center gap-8 items-center text-xs font-black uppercase tracking-[0.3em] text-indigo-400">
                    <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> AnishNova Tech</span>
                    <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Synapse Squad</span>
                </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="grid grid-cols-10 gap-2 p-4">
                    {Array.from({ length: 100 }).map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-white rounded-full" />
                    ))}
                </div>
            </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-widest text-slate-600">
        © 2026 FairAI Governance Engine • All Rights Reserveded to Fairness
      </footer>
    </div>
  );
}
