"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain, FileDigit, BarChart3, ShieldCheck, Database, Zap, ArrowRight,
  GitBranch, Play, TrendingUp, Star, ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";

// Helper: stable fade-up animation object (no custom fn, no Variants type issues)
function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: "easeOut" as const },
  };
}

export default function LandingPage() {
  const router = useRouter();

  const features = [
    { icon: <Database className="w-6 h-6" />, title: "Smart Dataset Profiling", desc: "Auto-detect sensitive columns, missing values, and data distributions with one click.", color: "from-blue-500 to-cyan-500" },
    { icon: <BarChart3 className="w-6 h-6" />, title: "5 Fairness Metrics", desc: "Demographic Parity, Equal Opportunity, Disparate Impact, Equalized Odds, and a composite Fairness Score.", color: "from-violet-500 to-purple-500" },
    { icon: <Brain className="w-6 h-6" />, title: "Gemini AI Explanation", desc: "Google Gemini analyzes your metrics and generates plain-language bias explanations with mitigation steps.", color: "from-pink-500 to-rose-500" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "80% Rule Compliance", desc: "Checks Disparate Impact against the legal 80% rule used in employment and lending cases.", color: "from-emerald-500 to-green-500" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Visual Dashboard", desc: "Real-time charts — gauge, bar, pie, and comparison charts built with Recharts.", color: "from-orange-500 to-amber-500" },
    { icon: <FileDigit className="w-6 h-6" />, title: "PDF Bias Report", desc: "Export a professional compliance report with all metrics, charts, and AI explanations.", color: "from-indigo-500 to-blue-500" },
    { name: "Explainable AI (XAI)", icon: <Zap className="w-6 h-6" />, title: "Explainable AI (XAI)", desc: "Interactive SHAP charts that explain which features drove the machine learning model's biased decisions.", color: "from-yellow-500 to-orange-500" },
  ];

  const techStack = [
    { name: "Next.js 14", cat: "Frontend" },
    { name: "React", cat: "Frontend" },
    { name: "TailwindCSS", cat: "Styling" },
    { name: "Framer Motion", cat: "Animation" },
    { name: "Recharts", cat: "Charts" },
    { name: "FastAPI", cat: "Backend" },
    { name: "Python", cat: "Backend" },
    { name: "Fairlearn", cat: "ML" },
    { name: "AIF360", cat: "ML" },
    { name: "Scikit-learn", cat: "ML" },
    { name: "Gemini AI", cat: "AI" },
    { name: "Render", cat: "DevOps" },
  ];

  const teamMembers = [
    { name: "Anish Raj", role: "Lead Developer & AI Engineer (Leader)", email: "anishkumar9905287@gmail.com", skills: ["Full-Stack", "ML", "DevOps"] },
    { name: "Amrit Anand", role: "Frontend Developer & UI/UX", email: "rounakjha122@gmail.com", skills: ["React", "UI/UX", "Tailwind"] },
    { name: "Subham Sharma", role: "Backend Developer & Data Science", email: "subhamsharma765688@gmail.com", skills: ["Python", "FastAPI", "Pandas"] },
    { name: "Kapil Vishwakarma", role: "AI Researcher & Analyst", email: "kapilbhai758@gmail.com", skills: ["Fairness AI", "Testing", "Research"] },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 min-h-screen text-white overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-20 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-5 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm"
          >
            <Star className="w-4 h-4 fill-indigo-400 text-indigo-400" />
            Google Solution Challenge 2026 · Team Synapse Squad Hub
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05]"
          >
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              Fair
            </span>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              AI
            </span>
            <br />
            <span className="text-4xl md:text-5xl font-bold text-slate-300">
              Bias Detection Platform
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="mt-8 text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            Detect, explain, and eliminate bias in AI systems using
            <span className="text-indigo-400 font-semibold"> industry-standard fairness metrics </span>
            and
            <span className="text-purple-400 font-semibold"> Google Gemini AI</span>.
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/upload"
              className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-500/30 transition-all hover:-translate-y-1 hover:shadow-indigo-500/50"
            >
              <Database className="w-5 h-5" />
              Upload Dataset
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => {
                localStorage.setItem("dataset_info", JSON.stringify({
                  filename: "sample_bias_dataset.csv",
                  shape: { rows: 500, cols: 5 },
                  columns: ["gender", "age", "income", "education", "loan_approved"],
                  sensitive_column_hints: ["gender"],
                  preview: [],
                }));
                localStorage.setItem("demo_mode", "sample_bias_dataset.csv");
                router.push("/dashboard");
              }}
              className="group flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-lg backdrop-blur-sm transition-all hover:-translate-y-1"
            >
              <Play className="w-5 h-5 text-emerald-400" />
              Run Demo Analysis
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fadeUp(0.4)}
            className="mt-16 flex justify-center gap-12 flex-wrap"
          >
            {[
              { val: "5+", label: "Fairness Metrics" },
              { val: "3", label: "Demo Datasets" },
              { val: "Gemini AI", label: "Powered By" },
              { val: "100%", label: "Open Source" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black text-white">{s.val}</div>
                <div className="text-slate-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LIVE DEMO SECTION ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-950/80 to-purple-950/80 backdrop-blur-xl p-10 md:p-16"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-1.5 rounded-full font-semibold mb-6">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Live Bias Demo
                </div>
                <h2 className="text-4xl font-bold text-white leading-tight">
                  See FairAI in<br />
                  <span className="text-indigo-400">Action — Instantly</span>
                </h2>
                <p className="mt-4 text-slate-400 text-lg">
                  No dataset? No problem. Click <strong className="text-white">Run Demo Analysis</strong> to load our pre-built loan approval dataset and see every bias metric, chart, and AI explanation generated live.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/upload"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                  >
                    <Database className="w-4 h-4" />
                    Upload My Dataset
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.setItem("dataset_info", JSON.stringify({
                        filename: "sample_bias_dataset.csv",
                        shape: { rows: 500, cols: 5 },
                        columns: ["gender", "age", "income", "education", "loan_approved"],
                        sensitive_column_hints: ["gender"],
                        preview: [],
                      }));
                      localStorage.setItem("demo_mode", "sample_bias_dataset.csv");
                      router.push("/dashboard");
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
                  >
                    <Play className="w-4 h-4" />
                    Run Demo Analysis
                  </button>
                </div>
              </div>

              {/* Mini metrics preview */}
              <div className="space-y-4">
                {[
                  { label: "Fairness Score", value: "62/100", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", bar: 62, barColor: "bg-orange-500" },
                  { label: "Demographic Parity", value: "0.25 ⚠ High Bias", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", bar: 25, barColor: "bg-red-500" },
                  { label: "Disparate Impact", value: "0.64 – Fails 80% Rule", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", bar: 64, barColor: "bg-red-500" },
                  { label: "Equal Opportunity", value: "0.18", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", bar: 82, barColor: "bg-yellow-500" },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, ease: "easeOut" as const }}
                    className={`rounded-xl p-4 border ${m.bg} backdrop-blur-sm`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 text-sm font-medium">{m.label}</span>
                      <span className={`${m.color} font-bold text-sm`}>{m.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.bar}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: "easeOut" as const }}
                        className={`h-full rounded-full ${m.barColor}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Everything you need for
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> Responsible AI</span>
            </h2>
            <p className="mt-4 text-slate-400 text-xl max-w-2xl mx-auto">
              A complete toolkit for detecting, visualizing, and mitigating bias in ML systems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" as const }}
                className="group relative p-7 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.color} text-white mb-5 shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white">System Architecture</h2>
            <p className="mt-4 text-slate-400 text-xl">Clean, modular, production-ready design</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                layer: "01", name: "Frontend Layer", color: "from-blue-500 to-cyan-500",
                items: ["Next.js 14 + React", "Tailwind CSS + Shadcn UI", "Recharts Visualizations", "Framer Motion Animations"],
              },
              {
                layer: "02", name: "AI & ML Layer", color: "from-purple-500 to-pink-500",
                items: ["Microsoft Fairlearn", "IBM AIF360", "Google Gemini API", "Scikit-learn"],
              },
              {
                layer: "03", name: "Backend Layer", color: "from-emerald-500 to-teal-500",
                items: ["FastAPI + Uvicorn", "Pandas + NumPy", "REST API Endpoints", "Render / Cloud Run Deployment"],
              },
            ].map((arch, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="p-7 rounded-2xl border border-white/5 bg-white/[0.03]"
              >
                <div className={`text-xs font-black bg-gradient-to-r ${arch.color} bg-clip-text text-transparent mb-3`}>
                  LAYER {arch.layer}
                </div>
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${arch.color} bg-clip-text text-transparent mb-5`}>
                  {arch.name}
                </h3>
                <ul className="space-y-3">
                  {arch.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-300">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${arch.color} shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold text-white mb-14"
          >
            Technology Stack
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 transition-all"
              >
                <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">{t.cat}</span>
                <span className="text-white font-bold">{t.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="about" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Meet the Team</h2>
            <p className="text-slate-400 text-xl mb-14">Built for the Google Solution Challenge 2026</p>

            <div className="flex flex-wrap justify-center gap-8">
              {teamMembers.map((member, i) => (
                <div key={i} className="p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm max-w-xs w-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white mx-auto mb-4">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-indigo-300 font-semibold mt-1 mb-1">{member.role}</p>
                  <p className="text-slate-400 text-sm mb-4">{member.email}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.skills.map((skill, j) => (
                      <span key={j} className="px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/upload"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 shadow-xl shadow-indigo-500/30"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://github.com/buildwithanish/googlehackthon"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                <GitBranch className="w-5 h-5" />
                View on GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
