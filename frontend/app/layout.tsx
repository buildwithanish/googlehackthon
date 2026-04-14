import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatSupport from "@/components/ChatSupport";
import BackendWakeup from "@/components/BackendWakeup";
import MouseGlow from "@/components/MouseGlow";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "FairAI – Universal Data Intelligence Platform",
  description: "Enterprise-grade AI bias detection and data intelligence suite powered by Google Gemini.",
  openGraph: {
    title: "FairAI – Data Intelligence Platform",
    description: "Detect, explain, and eliminate bias in AI systems with automated BI analytics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} font-inter bg-[#050505] text-white min-h-screen flex flex-col selection:bg-indigo-500/30 selection:text-white`}
        suppressHydrationWarning
      >
        {/* ── PREMIUM GLOBAL EFFECTS ── */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-[#0b0b1a] to-[#050505]" />
            
            {/* Floating Glows */}
            <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[10%] right-[15%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse delay-1000" />
            
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.03]" />
        </div>

        <MouseGlow />
        <BackendWakeup />
        <Navbar />
        
        {/* Main Content Wrapper */}
        <main className="flex-1 flex flex-col pt-20">
            {children}
        </main>
        
        <Footer />
        <ChatSupport />
      </body>
    </html>
  );
}
