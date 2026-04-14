"use client";
import { motion } from "framer-motion";
import { HelpCircle, RefreshCw, DollarSign, CheckCircle } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 py-24">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-5xl font-black text-white mb-4">Refund Policy</h1>
          <p className="text-emerald-400 font-semibold tracking-widest uppercase text-xs">Policy Version 2.0 (2026)</p>
        </motion.div>

        <div className="space-y-12 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              1. Enterprise Subscriptions
            </h2>
            <p>
              FairAI offers various tiers of service. For our Enterprise Tier, we offer a 14-day "No Questions Asked" money-back guarantee. If our Antigravity engine does not meet your governance requirements, you are entitled to a full refund within this period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-500" />
              2. Refund Process
            </h2>
            <p>
              To initiate a refund, please contact our support team at <span className="text-emerald-400">anishkumar9905287@gmail.com</span> with your organization's Run ID and Subscription details. Refunds are typicaly processed within 5-7 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              3. Exceptions
            </h2>
            <p>
              Refunds are not available for "Pay-per-Analysis" tokens that have already been fully consumed by the Google Gemini API processing. However, if a technical failure prevents the report generation, a full token credit will be issued.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-white font-bold mb-2">Google Cloud API Credits</h3>
            <p className="text-sm">
              Please note that Google Cloud infrastructure costs incurred through your own linked Vertex AI projects are subject to Google's own billing and refund policies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
