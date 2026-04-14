"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X, Zap, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Upload", href: "/upload" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Simulator", href: "/simulator" },
    { name: "Metrics", href: "/metrics" },
    { name: "AI Report", href: "/ai-report" }
  ];

  return (
    <nav className="fixed top-0 z-[100] w-full bg-slate-950/80 border-b border-white/5 backdrop-blur-xl font-outfit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white uppercase italic">
              FairAI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all italic",
                  pathname === item.href
                    ? "text-indigo-400 bg-indigo-500/5"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/upload"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <Database className="w-4 h-4" /> Start Analysis
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-slate-400 hover:text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-slate-950 border-t border-white/5 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest italic",
                  pathname === item.href
                    ? "text-indigo-400 bg-indigo-500/5"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link 
              href="/upload" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs"
            >
              Start Analysis
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
