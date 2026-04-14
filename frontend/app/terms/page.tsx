"use client";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <Link href="/" className="text-xl font-black italic mb-12 block">FAIRAI</Link>
          <h1 className="text-5xl font-black italic mb-6">TERMS OF SERVICE</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Governing FairAI & AnishNova Tech</p>
        </header>

        <div className="space-y-12 text-slate-400 leading-relaxed font-medium">
          <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
            <h2 className="text-white text-xl font-black italic mb-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" /> ACCEPTABLE USE
            </h2>
            <p className="mb-4">
              FairAI is a governance tool. Users agree to use the platform solely for identifying and mitigating bias 
              in automated systems. 
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-500">
                <li>No unlawful data reverse-engineering.</li>
                <li>No automated scraping of the FairAI analytical engine.</li>
                <li>No sharing of audit reports for malicious purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-black italic mb-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-400" /> LIABILITY LIMITATION
            </h2>
            <p>
              FairAI provides mathematical metrics based on provided data. We are not responsible for legal decisions 
              made based on these reports. Final compliance responsibility remains with the deploying organization.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-black italic mb-4">INTELLECTUAL PROPERTY</h2>
            <p>
              The Antigravity Engine, UI components, and FairAI branding are intellectual property of 
              AnishNova Technologies and Synapse Squad Hub.
            </p>
          </section>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/5 text-center">
             <Link href="/dashboard" className="text-indigo-400 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">Accept & Enter Dashboard</Link>
        </footer>
      </div>
    </div>
  );
}
