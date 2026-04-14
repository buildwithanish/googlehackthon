"use client";
import { motion } from "framer-motion";
import { Users, Target, Rocket, Award, Shield } from "lucide-react";

export default function AboutPage() {
  const values = [
    { icon: <Shield />, title: "Trust", desc: "Building transparent AI systems that society can rely on." },
    { icon: <Target />, title: "Precision", desc: "Mathematical accuracy in bias detection using industrial solvers." },
    { icon: <Award />, title: "Compliance", desc: "Ensuring global regulatory standards are met with one click." }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300">
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-full -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-black text-white mb-6">
            Our Mission at <span className="text-indigo-500">FairAI</span>
          </motion.h1>
          <p className="text-xl max-w-3xl mx-auto text-slate-400 leading-relaxed">
            We are a collective of engineers and ethicists at <span className="text-white font-bold text-indigo-400">AnishNova Technologies</span>, dedicated to solving the most pressing challenge of the 21st century: <strong>Algorithmic Bias</strong>. 
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                className="p-10 rounded-3xl border border-white/10 bg-white/[0.02] text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-6">
                  {v.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{v.title}</h3>
                <p className="text-slate-500">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-lg leading-relaxed space-y-8">
          <p>
            The Antigravity engine was born out of a simple observation: AI is everywhere, but it isn't always fair. Whether it's a loan application being rejected or a resume being overlooked, these automated decisions change lives. 
          </p>
          <p>
            Through our partnership with **Google Cloud**, we've built a platform that democratizes AI auditing. We combine the power of **Fairlearn** and **AIF360** with the innovative reasoning of **Google Gemini** to give organizations the tools they need to be ethical, compliant, and successful.
          </p>
          <div className="p-8 border-l-4 border-indigo-500 bg-indigo-500/5 italic text-slate-300">
            "Software should serve everyone, regardless of demographic. FairAI is our promise to make that happen." — Anish Raj, Founder of AnishNova Technologies.
          </div>
        </div>
      </section>
    </div>
  );
}
