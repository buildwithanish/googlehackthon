import Link from "next/link";
import { 
  Brain, GitBranch, Shield, Heart, FileText, HelpCircle, 
  Linkedin, Twitter, Globe, ArrowUpRight, Zap, Target
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
                { icon: <Twitter className="w-5 h-5" />, href: "#" },
                { icon: <Linkedin className="w-5 h-5" />, href: "#" },
                { icon: <GitBranch className="w-5 h-5" />, href: "https://github.com/buildwithanish/googlehackthon" },
                { icon: <Globe className="w-5 h-5" />, href: "https://anishnova.tech" },
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noreferrer" 
                  className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-8">Platform</h4>
            <ul className="space-y-4">
              {[
                { name: "Upload Dataset", href: "/upload" },
                { name: "Bias Dashboard", href: "/dashboard" },
                { name: "Fairness Metrics", href: "/metrics" },
                { name: "AI Reports", href: "/report" },
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

          {/* Company & Legal */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-8">Governance</h4>
            <ul className="space-y-4">
              {[
                { name: "Our Mission", href: "/about", icon: <Target className="w-3 h-3" /> },
                { name: "Privacy Policy", href: "/privacy", icon: <Shield className="w-3 h-3" /> },
                { name: "Terms of Service", href: "/terms", icon: <FileText className="w-3 h-3" /> },
                { name: "Ethics Code", href: "/security", icon: <Zap className="w-3 h-3" /> },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-500 hover:text-indigo-400 text-sm font-semibold transition-all flex items-center justify-center lg:justify-start gap-2">
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-30" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Team Special Feature */}
          <div className="lg:col-span-4">
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-white/5 overflow-hidden group">
              <div className="absolute top-0 right-0 p-2.5 bg-indigo-500/20 text-indigo-400 rounded-bl-2xl">
                <Globe className="w-4 h-4 animate-spin-slow" />
              </div>
              <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-6 mb-4">Official Submission</h4>
              <div className="space-y-4 text-center lg:text-left">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-indigo-400 font-black uppercase tracking-widest pl-1">DEVELOPED BY</span>
                  <p className="text-xl font-black text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Team Synapse Squad Hub</p>
                </div>
                <div className="flex flex-col gap-1 pt-4 border-t border-white/5">
                  <span className="text-xs text-purple-400 font-black uppercase tracking-widest pl-1">ORGANIZATION</span>
                  <p className="text-lg font-bold text-slate-300">AnishNova Technologies</p>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] text-slate-500 font-bold uppercase tracking-wider group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                  Google Solution Challenge 2026
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <p className="text-slate-500 text-sm font-bold tracking-tight">
              © 2026 FairAI Ecosystem. <span className="text-slate-700 font-normal">Registered under AnishNova Technologies.</span>
            </p>
            <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.3em]">
              Precision. Fairness. Transparency.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
             <div className="flex px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 items-center gap-2.5 shadow-2xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-300 text-[10px] font-black uppercase tracking-[0.15em]">Neural Engine Operational</span>
             </div>
             <p className="text-slate-600 text-[9px] font-medium max-w-xs text-center md:text-right leading-tight">
               Built with Google Cloud Run & Vertex AI Simulation Frameworks.
             </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </footer>
  );
}
