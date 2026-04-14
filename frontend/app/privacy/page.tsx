"use client";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, CheckCircle } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 py-24">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-5xl font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-indigo-400 font-semibold tracking-widest uppercase text-xs">Last Updated: April 14, 2026</p>
        </motion.div>

        <div className="space-y-12 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              1. Data Protection at FairAI
            </h2>
            <p>
              At FairAI, powered by AnishNova Technologies, your data privacy is our highest priority. We utilize end-to-end encryption for all dataset uploads. Any CSV file uploaded for bias analysis is processed in-memory and is NOT stored on our servers unless explicitly requested for historical tracking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-500" />
              2. Information We Collect
            </h2>
            <p>
              We only collect metadata required for the analysis (e.g., column names and distribution statistics). We do not collect PII (Personally Identifiable Information) unless it is essential for the fairness audit, in which case it is immediately anonymized using our Antigravity engine.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-500" />
              3. Cloud Infrastructure
            </h2>
            <p>
              Our infrastructure is powered by Google Cloud (Vertex AI and Cloud Run), ensuring world-class security standards (ISO 27001, SOC 2). Your audit logs are protected by multi-factor authentication and strict RBAC (Role-Based Access Control).
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
            <h3 className="text-white font-bold mb-2">Google Gemini Integration</h3>
            <p className="text-sm">
              We use Google Gemini 1.5 Pro for bias narrative generation. No raw dataset rows are sent to the LLM; only summary statistics and metric results are processed to ensure maximum privacy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
