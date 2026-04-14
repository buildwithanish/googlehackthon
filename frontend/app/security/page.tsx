"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Scale, Heart, Brain, Lock, CheckCircle } from "lucide-react";

export default function EthicsPage() {
  const principles = [
    { icon: <Scale />, title: "Mathematical Fairness", desc: "We adhere strictly to industrial fairness definitions, including Demographic Parity and Equalized Odds." },
    { icon: <Lock />, title: "Data Dignity", desc: "No raw data leaves your environment without explicit anonymization and hashing via the Antigravity Engine." },
    { icon: <Heart />, title: "Human-in-the-Loop", desc: "Our AI (Gemini) provides explanations, but we empower human auditors to make the final ethical decision." }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 py-24">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-6">
            <CheckCircle className="w-4 h-4" /> Ethical AI Charter
          </div>
          <h1 className="text-6xl font-black text-white mb-6">FairAI Code of Ethics</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            By **Team Synapse Squad Hub** | At AnishNova Technologies, we believe AI should be a tool for equality, not an engine for exclusion.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {principles.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mx-auto mb-6">
                {p.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
              <p className="text-slate-500 text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <section className="space-y-12 max-w-3xl mx-auto">
          <div className="border-l-4 border-indigo-500 pl-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Transparency First</h2>
            <p>Our algorithms are open to audit. We provide full traceability for every fairness score, allowing users to trace a metric back to specific feature correlations.</p>
          </div>

          <div className="border-l-4 border-purple-500 pl-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Bias Mitigation</h2>
            <p>Detection is only half the battle. We commit to providing actionable remediation steps for every identified bias, utilizing Google's advanced XAI (Explainable AI) frameworks.</p>
          </div>

          <div className="border-l-4 border-emerald-500 pl-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Continuous Monitoring</h2>
            <p>Bias isn't static. The Synapse Squad Hub developed FairAI to support temporal monitoring, ensuring models stay fair as real-world data distributions evolve.</p>
          </div>
        </section>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-24 p-12 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/20 text-center">
          <ShieldCheck className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Google Cloud Trusted Ecosystem</h3>
          <p className="text-slate-500 italic max-w-lg mx-auto">"Certified by the pursuit of ethical excellence and mathematical rigor."</p>
        </motion.div>
      </div>
    </div>
  );
}
