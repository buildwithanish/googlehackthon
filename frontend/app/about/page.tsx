"use client";
import { motion } from "framer-motion";
import { Heart, Target, Zap, Globe, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <nav className="p-8 border-b border-white/5">
        <Link href="/" className="text-xl font-black italic hover:text-indigo-400 transition-colors">FAIRAI</Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-24">
        <header className="mb-32 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-7xl font-black italic mb-8">
            BEYOND THE <span className="text-indigo-500">ALGORITHM</span>
          </motion.h1>
          <p className="text-slate-400 text-xl font-medium max-w-3xl mx-auto leading-relaxed">
            FairAI was born from a simple realization: algorithmic bias isn't just a technical glich—it's a systemic failure.
            We are building the tools to fix it.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-12 mb-32">
          {[
            { title: "Our Mission", icon: <Target className="w-8 h-8 text-indigo-400" />, desc: "To democratize fairness auditing for every ML team on the planet." },
            { title: "Our Team", icon: <Users className="w-8 h-8 text-indigo-400" />, desc: "Synapse Squad Hub — A collective of engineers committed to ethical AI." },
            { title: "Our Origin", icon: <Globe className="w-8 h-8 text-indigo-400" />, desc: "Developed by AnishNova Technologies for the Google Solution Challenge 2026." }
          ].map((item, i) => (
            <motion.div key={i} className="space-y-6">
              <div className="p-4 bg-indigo-500/10 rounded-2xl w-fit">{item.icon}</div>
              <h3 className="text-2xl font-black italic">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        <section className="p-16 rounded-[60px] bg-white/[0.02] border border-white/5 text-center">
            <h2 className="text-3xl font-black mb-8 italic">POWERED BY ANISHNOVA TECHNOLOGIES</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-10">
                A leading software company focused on high-performance AI solutions, web architectures, and decentralized governance.
            </p>
            <div className="flex justify-center gap-6">
                 <Link href="/dashboard" className="px-8 py-4 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all">Go to Dashboard</Link>
                 <Link href="/" className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">Back Home</Link>
            </div>
        </section>
      </main>
    </div>
  );
}
