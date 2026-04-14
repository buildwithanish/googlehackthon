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
  title: "FairAI – Bias Detection Platform",
  description: "Powered by FairAI, AnishNova Technologies, and Google Gemini AI. Bias Detection Platform",
  openGraph: {
    title: "FairAI – Bias Detection Platform",
    description: "Ensure fairness and detect bias in automated AI decision systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-slate-950 text-white min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <BackendWakeup />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatSupport />
      </body>
    </html>
  );
}
