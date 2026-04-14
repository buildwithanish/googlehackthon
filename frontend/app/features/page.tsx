"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useEffect } from "react";

const featuresData = [
  { id: 1, title: "Smart Dataset Profiling", desc: "Auto-detect sensitive columns, missing values, and data distributions with one click.", color: "from-blue-500 to-cyan-500" },
  { id: 2, title: "5 Fairness Metrics", desc: "Demographic Parity, Equal Opportunity, Disparate Impact, Equalized Odds, and a composite Fairness Score.", color: "from-violet-500 to-purple-500" },
  { id: 3, title: "Gemini AI Explanation", desc: "Google Gemini analyzes your metrics and generates plain-language bias explanations with mitigation steps.", color: "from-pink-500 to-rose-500" },
  { id: 4, title: "80% Rule Compliance", desc: "Checks Disparate Impact against the legal 80% rule used in employment and lending cases.", color: "from-emerald-500 to-green-500" },
  { id: 5, title: "Visual Dashboard", desc: "Real-time charts — gauge, bar, pie, and comparison charts built with Recharts.", color: "from-orange-500 to-amber-500" },
  { id: 6, title: "PDF Bias Report", desc: "Export a professional compliance report with all metrics, charts, and AI explanations.", color: "from-indigo-500 to-blue-500" },
  { id: 7, title: "Explainable AI (XAI)", desc: "Interactive SHAP charts that explain which features drove the machine learning model's biased decisions.", color: "from-yellow-500 to-orange-500" },
  { id: 8, title: "Real-Time Mitigation", desc: "Actionable recommendations processed in real-time as your model re-trains on the stream.", color: "from-teal-500 to-emerald-500" },
  { id: 9, title: "Data Anonymization", desc: "Automatically mask PII and sensitive intersections before it hits your models.", color: "from-slate-500 to-gray-500" },
  { id: 10, title: "Intersectionality", desc: "Detect complex biases that span multiple sensitive traits (e.g. Black Women).", color: "from-fuchsia-500 to-pink-500" },
  { id: 11, title: "Synthetic Data Gen", desc: "Leverage AI to synthetically upsample minority groups while preserving feature variance.", color: "from-blue-600 to-indigo-600" },
  { id: 12, title: "Multi-Model Support", desc: "Native integrations for XGBoost, Random Forest, PyTorch, and TensorFlow.", color: "from-purple-600 to-indigo-600" },
  { id: 13, title: "API Scanning", desc: "Hooks directly into your live API endpoints to scan real-world traffic inference bias.", color: "from-cyan-500 to-blue-500" },
  { id: 14, title: "Custom Thresholds", desc: "Define your own business-specific fairness thresholds to trigger live alerts.", color: "from-gray-500 to-slate-500" },
  { id: 15, title: "Role-Based Access", desc: "Full enterprise granular access control for legal, data science, and product teams.", color: "from-orange-500 to-red-500" },
  { id: 16, title: "NLP Bias Detection", desc: "Check language models and datasets for toxic or historically biased phrasing.", color: "from-sky-500 to-indigo-500" },
  { id: 17, title: "Adversarial Debiasing", desc: "Use GAN architectures to learn feature representations that hide protected attributes.", color: "from-stone-500 to-neutral-500" },
  { id: 18, title: "Compliance Auditing", desc: "Generate instant EU AI Act and GDPR compliant audit trails of data usage.", color: "from-green-500 to-teal-500" },
  { id: 19, title: "Historical Tracking", desc: "Log and visualize equity metrics over months of deployment to avoid model drift.", color: "from-indigo-500 to-blue-500" },
  { id: 20, title: "Visual Importance", desc: "Dynamic tree and permutation importance to see exactly what shapes your output.", color: "from-rose-500 to-pink-500" }
];

export default function FeaturesPage() {
  // Handle scrolling to hash smoothly on load
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 500);
      }
    }
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-white pt-24 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold mb-12 group transition-colors">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Platform
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 text-transparent bg-clip-text leading-tight mb-6">
            20 Powerful Features
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Explore the deep technical architecture and robust compliance toolkit we built to ensure reliable and fair AI generation.
          </p>
        </motion.div>

        <div className="space-y-32">
          {featuresData.map((f, i) => (
            <motion.section 
              id={`feature-${f.id}`} 
              key={f.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`relative flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Massive Graphic Placeholder */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className={`w-full md:w-1/2 aspect-video rounded-3xl p-1 bg-gradient-to-br ${f.color} shadow-2xl relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/40 mix-blend-overlay" />
                <div className="w-full h-full bg-slate-950 rounded-[1.4rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border border-white/10">
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${f.color} rounded-full blur-3xl opacity-20`} />
                  <div className={`text-6xl font-black bg-gradient-to-br ${f.color} bg-clip-text text-transparent opacity-80 z-10`}>
                    F-{f.id < 10 ? '0'+f.id : f.id}
                  </div>
                  <h3 className="mt-4 text-2xl font-bold z-10">{f.title}</h3>
                </div>
              </motion.div>

              {/* Text Description */}
              <div className="w-full md:w-1/2">
                <h2 className="text-4xl font-bold mb-6">{f.title}</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">{f.desc}</p>
                <ul className="space-y-4">
                  {[1, 2, 3].map((_, j) => (
                    <motion.li 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (j * 0.1) }}
                      key={j} 
                      className="flex items-center gap-3 text-slate-400"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      Enhanced precision and high-availability architecture ready for production loads.
                    </motion.li>
                  ))}
                </ul>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`mt-10 px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-semibold shadow-lg`}
                >
                  Request Integration Demo
                </motion.button>
              </div>
            </motion.section>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 text-center p-12 bg-indigo-900/20 border border-indigo-500/20 rounded-3xl"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to test these features?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Our prototype includes these capabilities out of the box so you can ensure your models meet ethical guidelines from day one.</p>
          <Link href="/upload" className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all hover:scale-105 shadow-xl shadow-indigo-500/20">
            Start AI Profiling Framework
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
