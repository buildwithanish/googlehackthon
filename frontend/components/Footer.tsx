import Link from "next/link";
import { Brain, GitBranch, Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                FairAI
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Ensuring fairness and detecting bias in automated AI decision systems.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="https://github.com/buildwithanish/googlehackthon" target="_blank" rel="noreferrer"
                className="text-slate-500 hover:text-white transition-colors">
                <GitBranch className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              {[
                { name: "Upload Dataset", href: "/upload" },
                { name: "Bias Dashboard", href: "/dashboard" },
                { name: "Fairness Metrics", href: "/metrics" },
                { name: "AI Bias Report", href: "/report" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Team */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hackathon</h4>
            <div className="space-y-2 text-sm text-slate-500">
              <p>🏆 Google Solution Challenge 2026</p>
              <p>👨‍💻 Developed by <span className="text-indigo-400 font-semibold">Anish</span></p>
              <p>🚀 Team: <span className="text-purple-400 font-semibold">Synapse Squad Hub</span></p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">
            © 2026 FairAI · Developed by Anish | Team Synapse Squad Hub
          </p>
          <p className="text-slate-700 text-xs">
            Powered by Fairlearn · AIF360 · Google Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}
