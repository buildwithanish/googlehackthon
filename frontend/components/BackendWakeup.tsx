"use client";
import { useEffect } from "react";
import { pingHealth } from "@/lib/api";

export default function BackendWakeup() {
  useEffect(() => {
    // Initial wakeup
    pingHealth();

    // Keep backend awake (Every 5 minutes)
    const interval = setInterval(() => {
      pingHealth();
      console.log("[FairAI] Keeping backend engine active...");
    }, 1000 * 60 * 5);
    
    return () => clearInterval(interval);
  }, []);

  return null;
}
