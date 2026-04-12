"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, FileDigit, BarChart3, ShieldCheck, Database, Layers, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-24 pb-32 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 flex items-center gap-2"
        >
          <Brain className="w-4 h-4" /> <span>Hackathon Winner Candidate 2026</span>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight max-w-4xl"
          variants={itemVariants}
          initial="initial"
          animate="animate"
        >
          Fair<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI</span> <span className="block md:inline">– Ethical AI Bias Detection Platform</span>
        </motion.h1>

        <motion.p 
          className="mt-6 text-xl text-gray-600 max-w-2xl"
          variants={itemVariants}
          initial="initial"
          animate="animate"
        >
          Detect and eliminate bias in machine learning systems using AI-powered fairness analysis. Ensure your models meet ethical standards with just a few clicks.
        </motion.p>

        <motion.div 
          className="mt-10 flex flex-col sm:flex-row gap-4"
          variants={itemVariants}
          initial="initial"
          animate="animate"
        >
          <Link href="/upload" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1">
            Upload Dataset
          </Link>
          <Link href="/dashboard" className="px-8 py-4 bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 rounded-xl font-semibold shadow-sm transition-all hover:-translate-y-1">
            View Demo
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
            <p className="mt-4 text-gray-500">Everything you need to audit and repair ML models.</p>
          </div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { title: "Dataset Profiling", icon: <Database />, desc: "Auto-detect sensitive columns and missing values." },
              { title: "Metrics Dashboard", icon: <BarChart3 />, desc: "Calculate Demographic Parity, Equal Opportunity, etc." },
              { title: "AI Mitigations", icon: <Brain />, desc: "Get actionable advice from Google Gemini API." },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Technology Stack</h2>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            {['Next.js 14', 'React', 'TailwindCSS', 'FastAPI', 'Python', 'Scikit-Learn', 'Gemini AI'].map(tech => (
              <div key={tech} className="text-xl font-bold font-mono py-2 px-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
