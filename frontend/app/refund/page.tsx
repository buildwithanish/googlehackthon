"use client";
import { DollarSign, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <Link href="/" className="text-xl font-black italic mb-12 block">FAIRAI</Link>
          <h1 className="text-5xl font-black italic mb-6">REFUND POLICY</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Standard Billing Governance</p>
        </header>

        <div className="space-y-12 text-slate-400 leading-relaxed font-medium">
          <section className="p-10 rounded-[40px] bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
            <h2 className="text-white text-xl font-black italic mb-4 flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-indigo-400" /> 30-DAY ASSURANCE
            </h2>
            <p>
              If our governance reports do not meet your technical audit requirements, we offer a full refund 
              within the first 30 days of subscription. No questions asked, just fair governance.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-black italic mb-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" /> ELIGIBILITY
            </h2>
            <ul className="list-disc list-inside space-y-4">
                <li>Refunds are applicable to the first billed cycle only.</li>
                <li>Request must be submitted via support@anishnova.com.</li>
                <li>Custom enterprise integration fees are non-refundable once deployed.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-black italic mb-4 flex items-center gap-3">
               <DollarSign className="w-5 h-5 text-indigo-400" /> PROCESSING TIME
            </h2>
            <p>
              Approved refunds are processed to the original payment method within 5-7 business days. 
              Bank-specific delays may apply.
            </p>
          </section>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/5 text-center">
             <Link href="/" className="text-indigo-400 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">Back to Mission</Link>
        </footer>
      </div>
    </div>
  );
}
