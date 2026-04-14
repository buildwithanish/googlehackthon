"use client";
import Link from "next/link";
import { 
  Brain, Shield, FileText, Activity, Scale, Heart, GitBranch
} from "lucide-react";

const Github = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-center md:text-left">
          
          {/* Section 1: Brand & Description */}
          <div className="space-y-6">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-white">FairAI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 font-medium">
              Enterprise-grade AI bias detection and data intelligence platform. Engineered for mathematical transparency and ethical clarity in algorithmic decision making.
            </p>
          </div>

          {/* Section 2: Platform Links */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-8">Platform</h4>
            <ul className="space-y-4">
              {[
                { name: "Upload Dataset", href: "/upload" },
                { name: "BI Dashboard", href: "/dashboard" },
                { name: "Bias Simulator", href: "/simulator" },
                { name: "Metrics Library", href: "/metrics" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-500 hover:text-indigo-400 text-sm font-bold transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Governance Links */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-8">Governance & Ethics</h4>
            <ul className="space-y-4">
              {[
                { name: "AI Report Hub", href: "/report" },
                { name: "Ethics Charter", href: "/ethics" },
                { name: "Governance Panel", href: "/governance" },
                { name: "Privacy & Compliance", href: "/privacy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-500 hover:text-indigo-400 text-sm font-bold transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Team Section */}
          <div className="bg-indigo-600/5 border border-indigo-500/10 p-8 rounded-3xl relative overflow-hidden group">
            <div className="relative z-10">
                <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-4">Team Synapse Squad Hub</h4>
                <p className="text-[10px] text-slate-500 font-bold mb-6 leading-relaxed">
                  Developed for the Google Solution Challenge 2026. Dedicated to fixing real-world algorithmic bias.
                </p>
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-white font-black italic">Lead Dev: Anish Kumar Raj</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Github className="w-3 h-3 text-slate-600" />
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">github.com/buildwithanish</span>
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Heart className="w-24 h-24 text-indigo-500" />
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest text-center">
            © 2026 FairAI Platform · Google Solution Challenge Entry
          </p>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase text-slate-700">Audit Node Online</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
