import Link from "next/link";
import { Brain, Shield, Code } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex bg-gradient-to-br from-indigo-600 to-purple-600 p-1.5 rounded-md">
              <Brain className="w-4 h-4 text-white" />
              <Shield className="w-3 h-3 text-white absolute -bottom-0.5 -right-0.5" />
            </div>
            <span className="font-bold text-lg text-gray-800">
              FairAI <span className="text-gray-400 font-normal">| Bias Detection Platform</span>
            </span>
          </div>

          <div className="flex flex-col items-center md:items-end text-sm text-gray-500">
            <p>Developed by Anish | Team: Synapse Squad Hub</p>
            <Link href="https://github.com/buildwithanish" target="_blank" className="hover:text-indigo-600 flex items-center gap-1 mt-1 transition-colors">
              <Code className="w-4 h-4" /> GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
