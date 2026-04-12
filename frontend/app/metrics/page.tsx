"use client";
import { useEffect, useState } from "react";
import { getFairnessMetrics } from "@/lib/api";
import { motion } from "framer-motion";
import { Scale, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

export default function MetricsPage() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFairnessMetrics()
      .then(res => setMetrics(res.metrics || []))
      .catch(err => {
        console.error("Failed to fetch metrics", err);
        // Fallback static metrics
        setMetrics([
          { name: "Demographic Parity", description: "Measures the difference in positive prediction rates between the best and worst performing demographic groups.", threshold: 0.1 },
          { name: "Equal Opportunity", description: "Measures the maximum difference in true positive rates.", threshold: 0.1 },
          { name: "Disparate Impact", description: "Ratio of positive prediction rates. Values below 0.8 violate the '80% Rule'.", threshold: 0.8 },
          { name: "Fairness Score", description: "Composite 0-100 score. 80+ is acceptable.", threshold: 80 }
        ] as any);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center text-indigo-600">Loading metrics...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Fairness Metrics Dictionary</h1>
        <p className="mt-4 text-xl text-gray-500">Understand the mathematical definitions of AI bias.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {metrics.map((m: any, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
            
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Scale className="text-indigo-600" /> {m.name}
            </h2>
            
            <p className="mt-4 text-gray-600 leading-relaxed text-lg">
              {m.description}
            </p>

            <div className="mt-8 bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" /> Interpretation Guide
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                  <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />
                  <span className="text-gray-600">Ideal Value: <strong className="text-gray-900">{m.ideal_value ?? "Optimal"}</strong></span>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                  <AlertTriangle className="text-orange-500 w-5 h-5 shrink-0" />
                  <span className="text-gray-600">Warning Threshold: <strong className="text-gray-900">{m.threshold}</strong></span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
