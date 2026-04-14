import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatSupport from "@/components/ChatSupport";
import BackendWakeup from "@/components/BackendWakeup";

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
