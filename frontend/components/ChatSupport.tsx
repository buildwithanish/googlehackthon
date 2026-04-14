"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

const FAQ_DATA = [
  { q: "What is FairAI?", a: "FairAI is an enterprise-grade bias detection and AI governance platform designed to ensure fairness in automated decision systems." },
  { q: "How do I run a bias audit?", a: "Go to the 'Upload' page to upload your CSV dataset. Select your sensitive feature (e.g., Gender) and target variable (e.g., Loan Approved), then click 'Run Analysis'." },
  { q: "What metrics are supported?", a: "We support Demographic Parity, Disparate Impact (80% rule), Equal Opportunity, and Intersectional Bias Matrices." },
  { q: "Can I simulate biased data?", a: "Yes! Use our 'Bias Simulator' to generate synthetic datasets with controlled bias parameters to test your models' robustness." },
  { q: "How do I get an AI report?", a: "After running an audit, our Gemini AI engine automatically generates a full explanation and remediation roadmap. You can export this as a PDF or PPT." },
];

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hello! I'm the FairAI Support Assistant. How can I help you ensure your AI systems are ethical and unbiased today?" }
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

    // Simple matching engine
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response = "I'm not quite sure about that. Try asking about bias detection, metrics, or report generation!";
      
      const match = FAQ_DATA.find(item => lowerText.includes(item.q.toLowerCase()) || item.q.toLowerCase().includes(lowerText));
      if (match) {
        response = match.a;
      } else if (lowerText.includes("hello") || lowerText.includes("hi")) {
        response = "Hi there! Ready to build fairer AI?";
      } else if (lowerText.includes("help")) {
        response = "I can help you navigate the Dashboard, explain Fairness Metrics, or guide you through the Bias Simulator!";
      }

      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[60] p-4 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-600/40 border border-indigo-400/20"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-8 z-[60] w-[350px] sm:w-[400px] h-[500px] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-indigo-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-200" />
                <span className="font-bold text-sm tracking-tight">FairAI Support AI</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-500/30 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase">Live</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
              {FAQ_DATA.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(item.q)}
                  className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[10px] font-bold text-slate-400 transition-colors"
                >
                  {item.q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask anything..."
                className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 ring-indigo-500"
              />
              <button 
                onClick={() => handleSend(input)}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
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
