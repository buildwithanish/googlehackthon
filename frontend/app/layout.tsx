import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatSupport from "@/components/ChatSupport";

const inter = Inter({ subsets: ["latin"] });

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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatSupport />
      </body>
    </html>
  );
}
