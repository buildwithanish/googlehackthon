"use client";
import { motion } from "framer-motion";
import { Shield, Lock, EyeOff, FileText } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <Link href="/" className="text-xl font-black italic mb-12 block">FAIRAI</Link>
          <h1 className="text-5xl font-black italic mb-6">PRIVACY POLICY</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Last Updated: April 2026</p>
        </header>

        <div className="space-y-12 text-slate-400 leading-relaxed font-medium">
          <section>
            <h2 className="text-white text-xl font-black italic mb-4 flex items-center gap-3">
              <Lock className="w-5 h-5 text-indigo-400" /> DATA SOVEREIGNTY
            </h2>
            <p>
              FairAI does not store, transmit, or monetize your uploaded datasets. Processing happens in-memory and 
              results are flushed immediately after report generation.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-black italic mb-4 flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-indigo-400" /> ZERO-TRACKING
            </h2>
            <p>
              We do not use cookie-based tracking or session recording. Your governance analysis is private and 
              intended solely for your compliance documentation.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-black italic mb-4 flex items-center gap-3">
              <Shield className="w-5 h-5 text-indigo-400" /> THIRD-PARTY APIS
            </h2>
            <p>
              When utilizing AI Explanations, data tokens are sent to Google Gemini API under strict enterprise 
              privacy constraints. No data is used to train subsequent models.
            </p>
          </section>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/5 text-center">
             <Link href="/" className="text-indigo-400 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">Return to Base</Link>
        </footer>
      </div>
    </div>
  );
}
