"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Shield, Scale, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Upload", href: "/upload" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Metrics", href: "/metrics" },
    { name: "AI Report", href: "/report" },
    { name: "Governance", href: "/governance" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 border-b border-white/5 backdrop-blur-xl shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-lg bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                FairAI
              </span>
              <span className="text-xs text-slate-500 font-medium -mt-0.5">Bias Detection</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname === item.href
                    ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/upload"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              <Zap className="w-4 h-4" />
              Run Analysis
            </Link>
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-400 hover:text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-slate-900/95 border-t border-white/5 px-4 pt-3 pb-4 space-y-1 backdrop-blur-xl"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-4 py-2.5 rounded-xl text-sm font-medium",
                pathname === item.href
                  ? "bg-indigo-500/15 text-indigo-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link href="/upload" className="block w-full text-center mt-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm">
            Run Analysis
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
