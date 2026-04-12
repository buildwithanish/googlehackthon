"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, FileText, Download, Lightbulb, UserCheck, ShieldAlert } from "lucide-react";

export default function AIReportPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  // MOCK DATA for Hackathon exhibition
  const mockReport = {
    explanation: "Based on the dataset analysis, there is a pronounced disparity in positive prediction rates favoring Male applicants over Female applicants. The Demographic Parity Difference of 0.25 exceeds the acceptable threshold of 0.1, indicating that the model is significantly biased towards one group.",
    mitigations: [
      "Reweighing: Assign different weights to training examples to compensate for the imbalance.",
      "Fairness Constraints: Apply bounded group loss constraints during model training.",
      "Threshold Adjustment: Use different decision thresholds for different demographic groups.",
      "Data Augmentation: Collect more representative samples for the disadvantaged groups."
    ],
    status: "HIGH BIAS"
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setReport(mockReport);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bot className="w-8 h-8 text-indigo-600" /> AI Bias Report
          </h1>
          <p className="mt-2 text-gray-500">Gemini-powered insights and mitigation strategies.</p>
        </div>
        {!report && (
          <button 
            onClick={handleGenerate} 
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
          >
            {loading ? "Generating..." : "Generate AI Report"}
          </button>
        )}
        {report && (
          <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition flex items-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        )}
      </div>

      {!report && !loading && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No report generated yet</h3>
          <p className="text-gray-500 mt-2">Click the button above to analyze your recent dataset with Google Gemini.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium text-lg">Gemini AI is analyzing model bias...</p>
        </div>
      )}

      {report && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex gap-4 items-start">
            <ShieldAlert className="text-red-500 w-8 h-8 mt-1 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-red-800">Executive Summary</h3>
              <p className="mt-2 text-red-700 leading-relaxed">{report.explanation}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Lightbulb className="text-indigo-500" /> Recommended Mitigations
            </h3>
            <ul className="space-y-4">
              {report.mitigations.map((m: string, i: number) => (
                <li key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 pt-1">{m}</span>
                </li>
              ))}
            </ul>
          </div>
          
        </motion.div>
      )}
    </div>
  );
}
