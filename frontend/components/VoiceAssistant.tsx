"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, Command, Terminal, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceAssistantProps {
  onCommand: (command: string) => void;
}

export default function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [lastSpeech, setLastSpeech] = useState("");
  const [showStatus, setShowStatus] = useState(false);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setShowStatus(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setLastSpeech(transcript);
      console.log("Voice Command:", transcript);
      
      if (transcript.includes("run demo") || transcript.includes("analysis")) {
        speak("Initializing AI bias analysis engine. Searching for disparities.");
        onCommand("run-analysis");
      } else if (transcript.includes("fairness score") || transcript.includes("score")) {
        speak("Fetching current fairness score metrics.");
        onCommand("show-score");
      } else if (transcript.includes("download") || transcript.includes("report")) {
        speak("Generating enterprise audit report. Please wait.");
        onCommand("download-report");
      } else if (transcript.includes("simulator") || transcript.includes("bias simulator")) {
        speak("Navigating to bias simulation environment.");
        onCommand("go-simulator");
      } else {
        speak("Command not recognized. Please try again.");
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setTimeout(() => setShowStatus(false), 3000);
    };

    recognition.start();
  }, [onCommand]);

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {showStatus && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="absolute bottom-20 right-0 w-64 p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                {isListening ? "Listening for Command..." : "Executing Command"}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium italic">
              {lastSpeech ? `"${lastSpeech}"` : "Try 'Run demo analysis'"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={startListening}
        className={`group relative p-5 rounded-full transition-all duration-500 ${
          isListening 
          ? "bg-indigo-600 shadow-[0_0_30px_rgba(79,70,229,0.5)] scale-110" 
          : "bg-slate-900 hover:bg-slate-800 border border-white/10 shadow-xl"
        }`}
      >
        {isListening ? (
          <Mic className="w-6 h-6 text-white animate-pulse" />
        ) : (
          <MicOff className="w-6 h-6 text-slate-400 group-hover:text-white" />
        )}
        
        {/* Decorative Ring */}
        <div className={`absolute inset-0 rounded-full border-2 border-indigo-500/0 transition-all duration-500 ${isListening ? "border-indigo-500/50 scale-125 opacity-0" : ""}`} />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-600 rounded-lg text-[10px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Voice AI Mode
        </div>
      </button>
    </div>
  );
}
