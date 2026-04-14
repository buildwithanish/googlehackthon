"use client";
import Link from "next/link";
import { 
  Brain, GitBranch, Shield, Heart, FileText, HelpCircle, 
  Zap, Activity, Code, Scale, RefreshCw, DollarSign
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 border-t border-white/5 pt-24 pb-12 overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20 text-center lg:text-left">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-4">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-500/20 group hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-white">
                Fair<span className="text-indigo-500">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm mx-auto lg:mx-0 mb-8 font-medium">
              Revolutionizing algorithmic governance through 
              <span className="text-white"> decentralized fairness metrics</span> and 
              <span className="text-indigo-400"> Google Gemini Intelligence</span>.
            </p>
            <div className="flex justify-center lg:justify-start gap-5">
              {[
                { icon: <Activity className="w-5 h-5" />, href: "#" },
                { icon: <Code className="w-5 h-5" />, href: "https://github.com/buildwithanish/googlehackthon" },
                { icon: <GitBranch className="w-5 h-5" />, href: "https://github.com/buildwithanish/googlehackthon" },
                { icon: <Shield className="w-5 h-5" />, href: "#" },
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noreferrer" 
                  className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-8">Platform</h4>
            <ul className="space-y-4">
              {[
                { name: "Bias Simulator", href: "/simulator", icon: <RefreshCw className="w-3 h-3" /> },
                { name: "Governance Panel", href: "/dashboard", icon: <Shield className="w-3 h-3" /> },
                { name: "AI Metrics", href: "/metrics", icon: <Activity className="w-3 h-3" /> },
                { name: "Reports", href: "/report", icon: <FileText className="w-3 h-3" /> },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-500 hover:text-indigo-400 text-sm font-semibold transition-all flex items-center justify-center lg:justify-start gap-2 group">
                    <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Ethics */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-8">Governance & Ethics</h4>
            <ul className="grid grid-cols-1 gap-4">
              {[
                { name: "AI Ethics Charter", href: "/ethics", icon: <Scale className="w-3 h-3" /> },
                { name: "About AnishNova", href: "/about", icon: <Heart className="w-3 h-3" /> },
                { name: "Privacy Policy", href: "/privacy", icon: <Shield className="w-3 h-3" /> },
                { name: "Terms & Conditions", href: "/terms", icon: <FileText className="w-3 h-3" /> },
                { name: "Refund Policy", href: "/refund", icon: <DollarSign className="w-3 h-3" /> },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-500 hover:text-indigo-400 text-sm font-semibold transition-all flex items-center justify-center lg:justify-start gap-2 group">
                    <span className="p-1 rounded bg-white/5 group-hover:bg-indigo-500/20 transition-colors">
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Submission Info */}
          <div className="lg:col-span-3">
            <div className="relative p-8 rounded-3xl bg-indigo-600/5 border border-indigo-500/10 overflow-hidden group">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4 text-indigo-400">Team Synapse Squad Hub</h4>
              <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
                Empowering the future of AI through mathematical transparency.
              </p>
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Official Project</div>
                <div className="text-sm font-black text-white italic">Google Solution Challenge '26</div>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5">
                 <p className="text-[10px] text-slate-600 font-bold uppercase italic">Dev: Anish Kumar Raj</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              © 2026 FairAI Ecosystem • A Product of AnishNova Technologies
            </p>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase text-slate-700 tracking-tighter">Engine v2.1.0 Online</span>
             </div>
             <div className="w-px h-4 bg-white/5" />
             <p className="text-slate-800 text-[9px] font-black uppercase tracking-widest">
               India • Global
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
