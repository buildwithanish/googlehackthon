"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X, Zap, ArrowRight, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Upload", href: "/upload" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Simulator", href: "/simulator" },
    { name: "Metrics", href: "/metrics" },
    { name: "AI Report", href: "/report" },
    { name: "Governance", href: "/governance" }
  ];

  return (
    <nav className="fixed top-0 z-[100] w-full px-6 py-4 font-outfit">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0F172A]/60 backdrop-blur-2xl border border-white/5 rounded-[30px] px-6 md:px-10 h-20 flex justify-between items-center shadow-2xl relative overflow-hidden group">
          
          {/* Internal Glow Effect */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <Link href="/" className="flex items-center gap-4 group/logo shrink-0">
            <div className="relative flex items-center justify-center p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-600/40 group-hover/logo:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-2xl tracking-tighter uppercase italic">FAIRAI</span>
              <span className="text-[8px] font-black tracking-[0.2em] text-indigo-400 uppercase italic">Algorithmic Governance</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all italic",
                  pathname === item.href
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/upload"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 border border-white/10"
            >
              <Zap className="w-4 h-4" /> Run Analysis
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-all"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="lg:hidden absolute top-28 left-6 right-6 p-8 bg-[#0b0b1a]/95 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-3xl z-55"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest italic",
                    pathname === item.href
                      ? "bg-indigo-600 text-white"
                      : "text-slate-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <hr className="border-white/5 my-3" />
              <Link
                href="/upload"
                onClick={() => setIsOpen(false)}
                className="w-full py-5 bg-white text-black text-center rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-3"
              >
                <Zap className="w-4 h-4" /> Start Real-Time Scan
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
