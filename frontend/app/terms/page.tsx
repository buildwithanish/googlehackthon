"use client";
import { motion } from "framer-motion";
import { FileText, Scale, Zap, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 py-24">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-5xl font-black text-white mb-4">Terms of Service</h1>
          <p className="text-purple-400 font-semibold tracking-widest uppercase text-xs">Effective Date: April 14, 2026</p>
        </motion.div>

        <div className="space-y-12 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-500" />
              1. Agreement to Terms
            </h2>
            <p>
              By accessing FairAI (the "Platform"), you agree to be bound by these Terms of Service. The platform is operated by AnishNova Technologies. If you do not agree with these terms, please refrain from using our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              2. Use License
            </h2>
            <p>
              FairAI grants you a limited, non-exclusive license to use our bias detection tools for internal auditing and research purposes. You may not attempt to decompile or reverse engineer any software contained on the Platform's backend or Antigravity engine.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-purple-500" />
              3. Disclaimer
            </h2>
            <p>
              The fairness metrics provided by FairAI are based on mathematical models (Fairlearn, AIF360) and AI explanations (Google Gemini). While highly accurate, these results should be used as a guide for ethical decision-making and do not constitute legal advice.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-purple-500/5 border border-purple-500/20">
            <h3 className="text-white font-bold mb-2">Compliance Responsibility</h3>
            <p className="text-sm">
              Users are solely responsible for ensuring their AI models comply with local and international regulations, including the EU AI Act and GDPR. FairAI is a tool to assist in that journey.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
