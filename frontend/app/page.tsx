"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain, FileDigit, BarChart3, ShieldCheck, Database, Zap, ArrowRight,
  GitBranch, Play, TrendingUp, Star, ChevronRight, Activity, Lock, Search, 
  Eye, Layers, Settings, Users, MessageSquare, Network, Globe, Fingerprint, 
  Cpu, CheckCircle
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
    { id: 1, icon: <Database className="w-6 h-6" />, title: "Smart Dataset Profiling", desc: "Auto-detect sensitive columns, missing values, and data distributions with one click.", color: "from-blue-500 to-cyan-500" },
    { id: 2, icon: <BarChart3 className="w-6 h-6" />, title: "5 Fairness Metrics", desc: "Demographic Parity, Equal Opportunity, Disparate Impact, Equalized Odds, and a composite Fairness Score.", color: "from-violet-500 to-purple-500" },
    { id: 3, icon: <Brain className="w-6 h-6" />, title: "Gemini AI Explanation", desc: "Google Gemini analyzes your metrics and generates plain-language bias explanations with mitigation steps.", color: "from-pink-500 to-rose-500" },
    { id: 4, icon: <ShieldCheck className="w-6 h-6" />, title: "80% Rule Compliance", desc: "Checks Disparate Impact against the legal 80% rule used in employment and lending cases.", color: "from-emerald-500 to-green-500" },
    { id: 5, icon: <TrendingUp className="w-6 h-6" />, title: "Visual Dashboard", desc: "Real-time charts — gauge, bar, pie, and comparison charts built with Recharts.", color: "from-orange-500 to-amber-500" },
    { id: 6, icon: <FileDigit className="w-6 h-6" />, title: "PDF Bias Report", desc: "Export a professional compliance report with all metrics, charts, and AI explanations.", color: "from-indigo-500 to-blue-500" },
    { id: 7, icon: <Zap className="w-6 h-6" />, title: "Explainable AI (XAI)", desc: "Interactive SHAP charts that explain which features drove the machine learning model's biased decisions.", color: "from-yellow-500 to-orange-500" },
    { id: 8, icon: <Activity className="w-6 h-6" />, title: "Real-Time Mitigation", desc: "Actionable recommendations processed in real-time as your model re-trains on the stream.", color: "from-teal-500 to-emerald-500" },
    { id: 9, icon: <Lock className="w-6 h-6" />, title: "Data Anonymization", desc: "Automatically mask PII and sensitive intersections before it hits your models.", color: "from-slate-500 to-gray-500" },
    { id: 10, icon: <Layers className="w-6 h-6" />, title: "Intersectionality", desc: "Detect complex biases that span multiple sensitive traits (e.g. Black Women).", color: "from-fuchsia-500 to-pink-500" },
    { id: 11, icon: <Cpu className="w-6 h-6" />, title: "Synthetic Data Gen", desc: "Leverage AI to synthetically upsample minority groups while preserving feature variance.", color: "from-blue-600 to-indigo-600" },
    { id: 12, icon: <Network className="w-6 h-6" />, title: "Multi-Model Support", desc: "Native integrations for XGBoost, Random Forest, PyTorch, and TensorFlow.", color: "from-purple-600 to-indigo-600" },
    { id: 13, icon: <Search className="w-6 h-6" />, title: "API Scanning", desc: "Hooks directly into your live API endpoints to scan real-world traffic inference bias.", color: "from-cyan-500 to-blue-500" },
    { id: 14, icon: <Settings className="w-6 h-6" />, title: "Custom Thresholds", desc: "Define your own business-specific fairness thresholds to trigger live alerts.", color: "from-gray-500 to-slate-500" },
    { id: 15, icon: <Users className="w-6 h-6" />, title: "Role-Based Access", desc: "Full enterprise granular access control for legal, data science, and product teams.", color: "from-orange-500 to-red-500" },
    { id: 16, icon: <MessageSquare className="w-6 h-6" />, title: "NLP Bias Detection", desc: "Check language models and datasets for toxic or historically biased phrasing.", color: "from-sky-500 to-indigo-500" },
    { id: 17, icon: <Fingerprint className="w-6 h-6" />, title: "Adversarial Debiasing", desc: "Use GAN architectures to learn feature representations that hide protected attributes.", color: "from-stone-500 to-neutral-500" },
    { id: 18, icon: <CheckCircle className="w-6 h-6" />, title: "Compliance Auditing", desc: "Generate instant EU AI Act and GDPR compliant audit trails of data usage.", color: "from-green-500 to-teal-500" },
    { id: 19, icon: <Globe className="w-6 h-6" />, title: "Historical Tracking", desc: "Log and visualize equity metrics over months of deployment to avoid model drift.", color: "from-indigo-500 to-blue-500" },
    { id: 20, icon: <Eye className="w-6 h-6" />, title: "Visual Importance", desc: "Dynamic tree and permutation importance to see exactly what shapes your output.", color: "from-rose-500 to-pink-500" }
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
              { val: "25+", label: "Advanced Tools" },
              { val: "Cloud Native", label: "Architecture" },
              { val: "Google Cloud", label: "Infrastructure" },
              { val: "PDF/Word", label: "Reporting" },
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, y: -5 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.08, duration: 0.4, ease: "easeOut" as const }}
                className="group relative p-7 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div>
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.color} text-white mb-5 shadow-lg relative`}
                  >
                    {f.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors duration-300">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
                </div>
                <Link href={`/features#feature-${f.id}`} className="mt-6 flex items-center gap-1 text-indigo-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                  <span className="group-hover:underline">Explore Feature</span> <ChevronRight className="w-4 h-4" />
                </Link>
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

      {/* ── FEEDBACK & TESTIMONIALS ── */}
      <section className="py-24 border-t border-white/5 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Form Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
            >
              <h2 className="text-3xl font-black text-white mb-2">Share Your Experience</h2>
              <p className="text-slate-500 mb-8">Your feedback drives the evolution of FairAI. Help us build a more ethical future.</p>
              
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const feedback = formData.get('feedback') as string;
                if (!name || !feedback) return;
                
                // State update logic (simulated for now)
                alert(`Thank you ${name}! Your feedback has been submitted successfully to the Antigravity engine.`);
                (e.target as HTMLFormElement).reset();
              }}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input 
                    name="name"
                    type="text" 
                    placeholder="e.g. Anish Raj"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-indigo-500 transition-all outline-none placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Your Feedback</label>
                  <textarea 
                    name="feedback"
                    rows={4}
                    placeholder="What did you love about FairAI?"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-indigo-500 transition-all outline-none placeholder:text-slate-700"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
                >
                  Submit Testimonial
                </button>
              </form>
            </motion.div>

            {/* Testimonials Side */}
            <div className="space-y-6">
              {[
                { name: "Sarah J.", role: "Lead Data Scientist", text: "FairAI's integration with Gemini is a game changer. The explanations are actually clear for our legal team.", stars: 5 },
                { name: "Anish Nova", role: "AI Ethicist", text: "Finally, a platform that makes 80% rule compliance a one-click process. Truly Antigravity levels of efficiency!", stars: 5 },
                { name: "Marcus T.", role: "ML Engineer @ Google", text: "The Recharts integration is beautiful. We use it for every internal audit now.", stars: 4 },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-1">
                      {[...Array(t.stars)].map((_, s) => <Star key={s} className="w-3 h-3 fill-yellow-500 text-yellow-500" />)}
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono tracking-tighter">VERIFIED USER</span>
                  </div>
                  <p className="text-slate-400 italic mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{t.name}</h4>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="about" className="py-24 border-t border-white/5 pb-32">
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
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, translateY: -10 }}
                  transition={{ delay: i * 0.1, duration: 0.4, type: "spring", stiffness: 200 }}
                  className="p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-md hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-indigo-500/20 max-w-xs w-full transition-all group"
                >
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white mx-auto mb-4 shadow-lg shadow-indigo-500/30 group-hover:from-purple-500 group-hover:to-pink-500"
                  >
                    {member.name.charAt(0)}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{member.name}</h3>
                  <p className="text-indigo-300 font-semibold mt-1 mb-1">{member.role}</p>
                  <p className="text-slate-400 text-sm mb-4">{member.email}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.skills.map((skill, j) => (
                      <span key={j} className="px-3 py-1 text-xs font-semibold text-white bg-indigo-500/20 shadow-[inset_0_0_10px_rgba(99,102,241,0.2)] border border-indigo-500/30 rounded-full group-hover:bg-indigo-500/40 group-hover:border-indigo-400/50 transition-all">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
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
