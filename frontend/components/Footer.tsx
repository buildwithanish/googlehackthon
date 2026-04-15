"use client";
import Link from "next/link";
import { 
  Brain, Shield, FileText, Activity, Scale, Heart, GitBranch
} from "lucide-react";

const GithubIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#070B1A] border-t border-white/5 pt-24 pb-12 overflow-hidden font-outfit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20 text-center md:text-left">
          
          {/* Section 1: Brand & Description (LEFT) */}
          <div className="space-y-6">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-600/20">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-2xl tracking-tighter text-white uppercase italic">FairAI</span>
                <span className="text-[8px] font-black tracking-[0.2em] text-indigo-400 uppercase italic">Bias Detection Engine</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 font-medium italic">
              Revolutionizing algorithmic governance through decentralized fairness metrics and Google Gemini intelligence.
            </p>
          </div>

          {/* Section 2: Platform & Governance Links (CENTER) */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-8">Platform</h4>
              <ul className="space-y-4">
                {[
                  { name: "Upload", href: "/upload" },
                  { name: "Dashboard", href: "/dashboard" },
                  { name: "Metrics", href: "/metrics" },
                  { name: "Reports", href: "/ai-report" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-500 hover:text-indigo-400 text-xs font-black uppercase tracking-widest transition-all italic">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-8">Governance</h4>
              <ul className="space-y-4">
                {[
                  { name: "Ethics Charter", href: "/ethics" },
                  { name: "Privacy Policy", href: "/privacy" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-500 hover:text-indigo-400 text-xs font-black uppercase tracking-widest transition-all italic">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: Team Section (RIGHT) */}
          <div className="bg-indigo-600/5 border border-indigo-500/10 p-10 rounded-[40px] relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
                <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest">Team Synapse Squad Hub</h4>
                <div className="h-px w-12 bg-white/5" />
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] leading-relaxed italic">
                  Google Solution Challenge 2026
                </p>
                <div className="pt-2">
                    <p className="text-sm text-white font-black italic uppercase italic">Developer: Anish Kumar Raj</p>
                    <div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
                        <GithubIcon className="w-4 h-4 text-slate-600 hover:text-white transition-all cursor-pointer" />
                        <GitBranch className="w-4 h-4 text-slate-600" />
                    </div>
                </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.3em] text-center">
            © 2026 FairAI · Built for Google Solution Challenge
          </p>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
                <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Production Trace Active</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
