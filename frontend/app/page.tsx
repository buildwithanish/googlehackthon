"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Brain, FileDigit, BarChart3, ShieldCheck, Database, Zap, 
  ArrowRight, Play, CheckCircle, ShieldAlert, Activity, 
  Lock, Layers, Cpu, Network, Globe, Fingerprint, Settings, 
  Users, MessageSquare, Search, Eye, Github, LayoutGrid, Code, Cloud
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    { title: "Smart Dataset Profiling", icon: <Database className="w-6 h-6" /> },
    { title: "6 Fairness Metrics", icon: <BarChart3 className="w-6 h-6" /> },
    { title: "Gemini AI Explanations", icon: <Brain className="w-6 h-6" /> },
    { title: "Visual Dashboard", icon: <Activity className="w-6 h-6" /> },
    { title: "PDF Bias Report", icon: <FileDigit className="w-6 h-6" /> },
    { title: "Explainable AI (XAI)", icon: <Zap className="w-6 h-6" /> },
    { title: "Real-Time Mitigation", icon: <ShieldCheck className="w-6 h-6" /> },
    { title: "Data Anonymization", icon: <Lock className="w-6 h-6" /> },
    { title: "Intersectionality Analysis", icon: <Layers className="w-6 h-6" /> },
    { title: "Synthetic Data Generator", icon: <Cpu className="w-6 h-6" /> },
    { title: "Multi-Model Support", icon: <Network className="w-6 h-6" /> },
    { title: "API Scanning", icon: <Search className="w-6 h-6" /> },
    { title: "Custom Thresholds", icon: <Settings className="w-6 h-6" /> },
    { title: "Bias Score Monitoring", icon: <Eye className="w-6 h-6" /> },
  ];

  const techStack = [
    "Next.js", "React", "Tailwind CSS", "Python", "FastAPI", 
    "Pandas", "Scikit-learn", "Docker", "Google Cloud", "Gemini AI"
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-white flex flex-col font-outfit">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-32 pb-40 flex flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
             Google Solution Challenge 2026
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none italic">
            FairAI – <span className="text-indigo-500">Bias Detection</span> Platform
          </h1>
          
          <p className="text-xl md:text-2xl font-bold text-slate-400 max-w-3xl mx-auto leading-relaxed italic">
            Detect, explain, and eliminate bias in AI systems using fairness metrics and Google AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Link
              href="/upload"
              className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-sm tracking-widest transition-all shadow-2xl shadow-indigo-600/30 flex items-center gap-3"
            >
              <Database className="w-5 h-5" /> Upload Dataset
            </Link>
            <button
              onClick={() => router.push("/upload")}
              className="px-12 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
            >
              <Play className="w-4 h-4 text-indigo-500" /> Run Demo Analysis
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── 2. AI BIAS VS FAIRNESS ILLUSTRATION ── */}
      <section className="py-32 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            
            {/* AI Bias Diagram */}
            <div className="p-10 rounded-[40px] bg-slate-950 border border-rose-500/10 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <ShieldAlert className="w-20 h-20 text-rose-500" />
              </div>
              <h3 className="text-3xl font-black italic uppercase text-rose-500">AI Bias</h3>
              <div className="space-y-4">
                 {[1,2,3].map(i => (
                    <div key={i} className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full bg-rose-500/40 w-[${80 - (i*10)}%]`} />
                    </div>
                 ))}
              </div>
              <p className="text-slate-500 text-sm font-bold leading-relaxed">
                Unfair model behavior often stems from skewed training data, leading to discriminatory outcomes for protected groups.
              </p>
            </div>

            {/* Fair AI Output Diagram */}
            <div className="p-10 rounded-[40px] bg-slate-950 border border-indigo-500/10 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <ShieldCheck className="w-20 h-20 text-indigo-500" />
              </div>
              <h3 className="text-3xl font-black italic uppercase text-indigo-500">Fair AI Output</h3>
              <div className="space-y-4">
                 {[1,2,3].map(i => (
                    <div key={i} className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 w-[95%] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    </div>
                 ))}
              </div>
              <p className="text-slate-500 text-sm font-bold leading-relaxed">
                FairAI detects imbalances and applies mitigation strategies to ensure equitable decision-making across all cohorts.
              </p>
            </div>

          </div>
          
          <div className="mt-20 text-center">
             <p className="text-slate-400 max-w-2xl mx-auto text-sm font-bold italic leading-relaxed">
               FairAI audits your model's inference logs and training data to calculate Disparate Impact, Demographic Parity, and Equalized Odds, ensuring your AI adheres to the 80% rule.
             </p>
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES SECTION ── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">Everything you need for <span className="text-indigo-500">Responsible AI</span></h2>
             <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-[35px] bg-slate-900 border border-white/5 hover:border-indigo-500/30 transition-all group"
              >
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                  {f.icon}
                </div>
                <h4 className="text-base font-black italic uppercase text-white leading-tight">{f.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SYSTEM ARCHITECTURE ── */}
      <section className="py-32 bg-slate-900/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
             <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">System Architecture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { title: "Frontend Layer", icon: <LayoutGrid className="w-8 h-8" />, list: ["Next.js", "Tailwind CSS", "React Visualization"] },
               { title: "AI / ML Layer", icon: <Brain className="w-8 h-8" />, list: ["Bias Detection Engine", "Fairness Metrics", "XAI Module"] },
               { title: "Backend Layer", icon: <Code className="w-8 h-8" />, list: ["FastAPI", "Pandas", "Scikit-learn"] },
               { title: "Cloud Layer", icon: <Cloud className="w-8 h-8" />, list: ["Google Cloud", "Docker", "API Gateway"] }
             ].map((block, i) => (
                <div key={i} className="p-10 rounded-[40px] bg-slate-950 border border-indigo-500/10 text-center space-y-6">
                   <div className="w-16 h-16 bg-indigo-600/10 rounded-3xl flex items-center justify-center mx-auto text-indigo-400 mb-2">
                     {block.icon}
                   </div>
                   <h4 className="text-lg font-black italic uppercase">{block.title}</h4>
                   <ul className="space-y-3">
                      {block.list.map((item, j) => (
                        <li key={j} className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{item}</li>
                      ))}
                   </ul>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* ── 5. TECHNOLOGY STACK ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-600 mb-12 italic">Powered by Enterprise Grade Technology</h3>
           <div className="flex flex-wrap justify-center gap-4">
              {techStack.map((tech, i) => (
                <span key={i} className="px-6 py-2.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all hover:bg-indigo-600/20">
                  {tech}
                </span>
              ))}
           </div>
        </div>
      </section>

      {/* ── 6. TEAM SECTION ── */}
      <section className="py-32 bg-indigo-600/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter mb-20 text-white">Meet the Team</h2>
           
           <div className="relative p-12 rounded-[60px] bg-slate-950 border-2 border-indigo-500/10 overflow-hidden group">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]" />
              
              <div className="relative z-10 flex flex-col items-center gap-8">
                 <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[40px] flex items-center justify-center text-5xl font-black shadow-2xl shadow-indigo-600/30">
                    A
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black italic uppercase text-white">Anish Kumar Raj</h3>
                    <p className="text-sm font-black tracking-widest text-indigo-400 uppercase">Lead Developer & AI Engineer</p>
                    <div className="h-px w-20 bg-white/10 mx-auto" />
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Team Synapse Squad Hub</p>
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mt-4 italic">Google Solution Challenge 2026</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ── 7. CTA SECTION ── */}
      <section className="py-60 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-indigo-600/5 blur-[200px] rounded-full" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h3 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white mb-12">
                Ready for <span className="text-indigo-500">Ethical</span> Clarity?
            </h3>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link href="/upload" className="px-16 py-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[40px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/50 transition-all hover:scale-105">
                  Get Started Free
              </Link>
              <a href="https://github.com/buildwithanish/googlehackthon" target="_blank" rel="noreferrer" className="px-16 py-8 bg-white/5 border border-white/10 text-white rounded-[40px] font-black uppercase tracking-widest transition-all hover:bg-white/10 flex items-center gap-3">
                  <Github className="w-6 h-6" /> View on GitHub
              </a>
            </div>
        </div>
      </section>

    </div>
  );
}
