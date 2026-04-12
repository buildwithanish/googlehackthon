"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Legend 
} from "recharts";
import { ShieldCheck, Activity, BrainCircuit, Globe, TrendingUp, AlertTriangle, Fingerprint, Lock, Server, Users, Database } from "lucide-react";

export default function EnterpriseGovernance() {
  const [activeTab, setActiveTab] = useState("Governance Platform");

  const driftData = [
    { month: "Jan", score: 92, drift: 2 },
    { month: "Feb", score: 90, drift: 5 },
    { month: "Mar", score: 85, drift: 10 },
    { month: "Apr", score: 78, drift: 18 },
    { month: "May", score: 88, drift: 7 },
    { month: "Jun", score: 94, drift: 3 },
  ];

  const radarData = [
    { metric: "Diversity", value: 85 },
    { metric: "Transparency", value: 90 },
    { metric: "Compliance", value: 95 },
    { metric: "Fairness", value: 78 },
    { metric: "Privacy", value: 100 },
    { metric: "Robustness", value: 88 },
  ];

  const models = [
    { name: "HR Resume Screening AI", version: "v4.2.1", industry: "Hiring", risk: "High", status: "Review Required", score: 68 },
    { name: "Credit Default Predictor", version: "v2.0", industry: "Finance", risk: "Medium", status: "Approved", score: 85 },
    { name: "Patient Setup Triage", version: "v1.5", industry: "Healthcare", risk: "Critical", status: "Violated", score: 45 },
    { name: "Content Recommender", version: "v8.1", industry: "Media", risk: "Low", status: "Approved", score: 94 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <Server className="w-8 h-8 text-indigo-600" /> Enterprise Responsible AI Suite
        </h1>
        <p className="mt-2 text-gray-500 max-w-3xl">
          Unified command center for Model Registries, Regulatory Compliance, Active Monitoring, and Explainable AI.
        </p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 border-b border-gray-200">
        {["Governance Platform", "AI Monitoring System", "Enterprise Risk Profile", "Model Registry"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Governance Platform" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Enterprise Compliance</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">94<span className="text-base font-normal text-gray-500">/100</span></p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Database className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Active Models</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">24</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl"><AlertTriangle className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Policy Violations</p>
                <p className="text-3xl font-bold text-red-600 mt-1">3 <span className="text-sm font-normal text-gray-500">Alerts</span></p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Role Access</p>
                <p className="text-xl font-bold text-gray-900 mt-2">Admin / Analyst</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2"><Lock className="text-indigo-600" /> Regulatory & Ethics Compliance Checks</h3>
              <button className="text-indigo-600 text-sm font-semibold hover:underline">Download Audit Logs</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "EU AI Act Compliance Engine", status: "OK", score: "99%" },
                { name: "Demographic Neutrality Mandate", status: "Warning", score: "82%" },
                { name: "GDPR Explainability Tracker", status: "OK", score: "100%" },
                { name: "NYC Hiring AI Law (Local Law 144)", status: "Failed", score: "54%" }
              ].map((policy, i) => (
                <div key={i} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gray-50">
                  <span className="font-medium text-gray-700">{policy.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-gray-500">{policy.score}</span>
                    <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${
                      policy.status === "OK" ? "bg-green-100 text-green-700" : 
                      policy.status === "Warning" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                    }`}>{policy.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "AI Monitoring System" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Activity className="text-indigo-600" /> Continuous Fairness Drift Detection</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={driftData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#43CBFF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#43CBFF" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDrift" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6584" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF6584" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                    <XAxis dataKey="month" tick={{fill: '#6B7280'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#6B7280'}} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" name="Performance Score" stroke="#43CBFF" fillOpacity={1} fill="url(#colorScore)" />
                    <Area type="monotone" dataKey="drift" name="Bias Drift %" stroke="#FF6584" fillOpacity={1} fill="url(#colorDrift)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><BrainCircuit className="text-indigo-600" /> Responsible AI Health Diagnostics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Dataset Shift Anomaly</span>
                    <span className="text-sm font-medium text-red-600">8.4% Detected</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Protected Class Imbalance</span>
                    <span className="text-sm font-medium text-orange-500">Moderate</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Cross-Demographic Robustness</span>
                    <span className="text-sm font-medium text-green-600">Stable</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
                  <AlertTriangle className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800"><strong className="block">CRITICAL PIPELINE ALERT:</strong> The Healthcare Model v1.5 triggered a systemic fairness degradation alarm on Age demographics. Automated fallback initiated.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "Model Registry" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-lg text-gray-900">Deployed Models Inventory</h3>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">Register New Model</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 border-b">Model Name</th>
                  <th className="px-6 py-4 border-b">Version</th>
                  <th className="px-6 py-4 border-b">Industry Context</th>
                  <th className="px-6 py-4 border-b">Risk Level</th>
                  <th className="px-6 py-4 border-b">Governance Status</th>
                  <th className="px-6 py-4 border-b">Ethics Score</th>
                  <th className="px-6 py-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {models.map((model, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{model.name}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">{model.version}</td>
                    <td className="px-6 py-4 text-gray-700">{model.industry}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        model.risk === 'Critical' ? 'bg-red-100 text-red-700' :
                        model.risk === 'High' ? 'bg-orange-100 text-orange-700' :
                        model.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>{model.risk}</span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {model.status === "Approved" ? "✅ Approved Workflow" : "❌ " + model.status}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${model.score > 80 ? 'text-green-600' : model.score > 60 ? 'text-orange-500' : 'text-red-600'}`}>{model.score}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${model.score > 80 ? 'bg-green-500' : model.score > 60 ? 'bg-orange-500' : 'bg-red-500'}`} style={{width: `${model.score}%`}}></div></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-indigo-600 font-semibold text-sm hover:underline">View Telemetry</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === "Enterprise Risk Profile" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center items-center py-12">
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-2xl">
              <Fingerprint className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Multi-Model Cross-Demographic Risk Profile</h3>
              <p className="text-gray-500 mb-8">This module compiles real-time explainable insights utilizing Google Gemini across your entire AI ecosystem.</p>
              
              <div className="p-4 bg-gray-50 border border-dash border-gray-300 rounded-xl text-left">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2"><BrainCircuit className="w-4 h-4 text-purple-600"/> Gemini Automated Summary:</h4>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "Based on an audit of 24 active enterprise models, there is an overarching systemic bias risk in Applicant Tracking Models (ATMs) regarding demographic parity. Recommender systems demonstrate optimal fairness metrics. Mitigation involves applying adversarial debiasing limits to the Healthcare pipeline and reinforcing bounding thresholds in HR software."
                </p>
              </div>
              <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all">Generate Global Risk PDF</button>
           </div>
        </motion.div>
      )}
    </div>
  );
}
