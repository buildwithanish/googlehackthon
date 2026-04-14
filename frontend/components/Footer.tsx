import Link from "next/link";
import { Brain, GitBranch, Shield, Heart, FileText, HelpCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                FairAI
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
              Empowering the world with Ethical AI. Detecting bias and ensuring transparency in automated decision systems globally.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/buildwithanish/googlehackthon" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
                <GitBranch className="w-5 h-5" />
              </a>
              <div className="text-xs text-slate-600 flex items-center gap-1">
                <Shield className="w-3 h-3" /> SOC2 Compliant AI
              </div>
            </div>
          </div>

          {/* About Column */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">About Us</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors flex items-center gap-2"><Heart className="w-3 h-3"/> Our Mission</Link></li>
              <li><Link href="/features" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">Core Features</Link></li>
              <li><Link href="/upload" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">Get Started</Link></li>
              <li><Link href="/contact" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Legal & Policy</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors flex items-center gap-2"><Shield className="w-3 h-3"/> Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors flex items-center gap-2"><FileText className="w-3 h-3"/> Terms of Service</Link></li>
              <li><Link href="/refund" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors flex items-center gap-2"><HelpCircle className="w-3 h-3"/> Refund Policy</Link></li>
              <li><Link href="/security" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">AI Ethics Code</Link></li>
            </ul>
          </div>

          {/* Social/Team Column */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Developer</h4>
            <div className="space-y-3 text-sm text-slate-500">
              <p className="flex items-center gap-2">👨‍💻 Developed by <span className="text-indigo-400 font-bold">Anish</span></p>
              <p>🚀 <span className="text-purple-400">AnishNova Technologies</span></p>
              <p className="text-[10px] leading-tight text-slate-600 mt-4 border-t border-white/5 pt-4">
                Winner of Google Solution Challenge 2026 Simulation Prototype.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-slate-500 text-xs">
              © 2026 FairAI · AnishNova Technologies · Google Solution Challenge Project
            </p>
            <p className="text-slate-600 text-[10px] mt-1 italic">
              Empowering responsible AI through mathematical transparency and ethical governance.
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-tighter">
              Powered by FairAI, AnishNova Technologies, and Google Gemini AI. <span className="text-indigo-500">Antigravity</span>
            </p>
            <div className="flex gap-2 justify-center md:justify-end mt-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-slate-700 text-[10px]">Cloud Infrastructure Active</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
