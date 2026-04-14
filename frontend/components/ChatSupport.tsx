"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

const FAQ_DATA = [
  { q: "What is FairAI?", a: "FairAI is an enterprise-grade bias detection and AI governance platform designed to ensure fairness in automated decision systems." },
  { q: "FairAI kya hai?", a: "FairAI ek advanced platform hai jo AI systems mein bias (pakshpaat) ko detect karne aur usse theek karne ke liye banaya gaya hai." },
  { q: "How to run audit?", a: "Upload your CSV, select features, and click 'Run Analysis'." },
  { q: "Audit kaise kare?", a: "Apna CSV upload karein, sensitive features choose karein aur 'Run Analysis' pe click karein." },
  { q: "Is software safe?", a: "Yes, we prioritize data privacy and ethics." },
  { q: "Kya ye safe hai?", a: "Ji haan, hum data privacy aur ethics ko sabse zyada mahatva dete hain." },
];

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hello! I'm the FairAI Support Assistant. How can I help you ensure your AI systems are ethical and unbiased today? / Namaste! Main aapki kaise madad kar sakta hoon?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Multi-Language Response Engine
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response = "I'm not quite sure about that. Try asking about bias detection, metrics, or report generation! / Mujhe iske baare mein zyada pata nahi hai. Kripya bias detection ya report ke baare mein puchein.";
      
      const match = FAQ_DATA.find(item => lowerText.includes(item.q.toLowerCase()) || item.q.toLowerCase().includes(lowerText));
      
      if (match) {
        response = match.a;
      } else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("namaste") || lowerText.includes("greeting")) {
        response = "Hi! Ready to build fairer AI? / Namaste! Kya aap unbiased AI banane ke liye taiyaar hain?";
      } else if (lowerText.includes("kaise") || lowerText.includes("kya") || lowerText.includes("karu") || lowerText.includes("theek")) {
        response = "Hum aapko metrics, bias detection aur reports generate karne mein madad kar sakte hain. Dashboard check karein!";
      } else if (lowerText.includes("detect") || lowerText.includes("analyze") || lowerText.includes("audit")) {
        response = "To run an audit, upload your CSV file. The system will automatically detect bias patterns and generate insights using Google Gemini AI!";
      } else if (lowerText.includes("report") || lowerText.includes("pdf") || lowerText.includes("download")) {
        response = "After analysis, click 'Export Report' to download your audit as a PDF or PPTX. It includes AI remediation steps!";
      } else if (lowerText.includes("team") || lowerText.includes("who")) {
        response = "FairAI was built by Team Synapse Squad Hub (Anish, Amrit, Subham, Kapil) for the Google Solution Challenge 2026.";
      }

      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button - Moved Up to bottom-32 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-32 right-8 z-[60] p-4 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-600/40 border border-indigo-400/20"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-48 right-8 z-[60] w-[350px] sm:w-[400px] h-[550px] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-indigo-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-200" />
                <span className="font-bold text-sm tracking-tight">FairAI Support AI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-500/30 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase">Live</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-[13px] font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' 
                      : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar py-2 border-t border-white/5">
              {FAQ_DATA.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(item.q)}
                  className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-indigo-600/20 hover:text-indigo-300 border border-white/5 rounded-full text-[10px] font-bold text-slate-400 transition-all"
                >
                  {item.q}
                </button>
              ))}
            </div>

            {/* Close Session Button */}
            <div className="px-4 py-2 border-t border-white/5 bg-slate-950/20">
               <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
               >
                 Close Conversation
               </button>
            </div>

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask anything..."
                className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 ring-indigo-500 text-white placeholder:text-slate-500"
              />
              <button 
                onClick={() => handleSend(input)}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
