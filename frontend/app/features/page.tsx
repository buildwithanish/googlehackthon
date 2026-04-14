"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Database, BarChart3, Brain, ShieldCheck, TrendingUp, FileDigit, Zap, Activity, Lock, Layers, Cpu, Network, Search, Settings, Users, MessageSquare, Fingerprint, Globe, Eye } from "lucide-react";
import { useEffect } from "react";

const ALL_FEATURES = [
  {
    id: 1,
    icon: <Database className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500",
    title: "Smart Dataset Profiling",
    subtitle: "Auto-detect sensitive attributes and data quality issues",
    desc: "Upload any CSV and FairAI instantly profiles your data — detecting sensitive columns like gender, age, race, and income automatically using pattern recognition and NLP column name matching. Get a detailed data quality report showing missing values, unique counts, distributions, and outliers before running any analysis.",
    bullets: [
      "Automatic sensitive column detection using NLP name matching",
      "Missing value and outlier analysis with visual heatmaps",
      "Column type inference and suggested fairness configurations",
      "Support for up to 10MB CSVs with 100+ columns",
    ],
    tag: "Core Feature",
  },
  {
    id: 2,
    icon: <BarChart3 className="w-8 h-8" />,
    color: "from-violet-500 to-purple-500",
    title: "5 Fairness Metrics",
    subtitle: "Industry-standard bias quantification",
    desc: "FairAI calculates the five most important and legally-recognized fairness metrics simultaneously, giving you a complete picture of bias across every dimension. Each metric is explained in plain language alongside its industry threshold and legal context so non-technical stakeholders can understand the results.",
    bullets: [
      "Demographic Parity Difference — measures selection rate gaps (threshold: < 0.10)",
      "Equalized Odds Difference — measures error rate disparities across groups",
      "Disparate Impact Ratio — checks compliance with the EEOC 4/5ths rule (≥ 0.80)",
      "Predictive Parity — tests whether positive predictions carry equal precision",
      "Composite Fairness Score — weighted aggregation of all metrics into a single 0-100 score",
    ],
    tag: "ML Core",
  },
  {
    id: 3,
    icon: <Brain className="w-8 h-8" />,
    color: "from-pink-500 to-rose-500",
    title: "Google Gemini AI Explanation",
    subtitle: "Plain-language bias interpretation powered by LLM",
    desc: "FairAI sends your fairness metrics to Google Gemini's advanced language model, which generates a complete plain-language explanation of the bias patterns, their real-world implications, legal risks, and 5 targeted mitigation strategies. Non-ML stakeholders receive clear, actionable insights without needing data science expertise.",
    bullets: [
      "Full bias narrative explaining statistical findings in business language",
      "Legal risk assessment referencing EEOC, GDPR, and EU AI Act standards",
      "5 custom mitigation strategies ranked by impact and implementation effort",
      "Exportable as Markdown, JSON, or PDF compliance report",
    ],
    tag: "AI Powered",
  },
  {
    id: 4,
    icon: <ShieldCheck className="w-8 h-8" />,
    color: "from-emerald-500 to-green-500",
    title: "80% Rule Legal Compliance Check",
    subtitle: "Instant EEOC four-fifths rule validation",
    desc: "The EEOC's four-fifths (80%) rule is the most widely used legal standard for detecting discriminatory selection procedures in employment. FairAI automatically checks every demographic group combination against this rule and provides a pass/fail compliance report with the specific ratio values and recommended remediation steps.",
    bullets: [
      "Automatic 4/5ths rule computation for all group pairs",
      "Red/green compliance indicators for each group combination",
      "Annotated justification referencing EEOC Uniform Guidelines §1607",
      "Exportable pre-litigation evidence documentation format",
    ],
    tag: "Legal",
  },
  {
    id: 5,
    icon: <TrendingUp className="w-8 h-8" />,
    color: "from-orange-500 to-amber-500",
    title: "Interactive Visual Dashboard",
    subtitle: "Real-time animated charts and metrics",
    desc: "The FairAI dashboard provides rich, fully interactive visualizations to help detect and communicate bias. All charts update in real-time as you change sensitive attribute selections. Visualizations include gauge meters, grouped bar charts, donut pies, radar fairness maps, and group comparison charts — all built with Recharts and Framer Motion.",
    bullets: [
      "Fairness Gauge — animated speedometer showing composite score",
      "Grouped Bar Charts — side-by-side comparison of positive rates",
      "Pie/Donut Charts — demographic distribution visualization",
      "Radar Chart — multi-dimensional fairness map across all metrics",
    ],
    tag: "Visualization",
  },
  {
    id: 6,
    icon: <FileDigit className="w-8 h-8" />,
    color: "from-indigo-500 to-blue-500",
    title: "Professional Bias Report Export",
    subtitle: "One-click JSON and Markdown report generation",
    desc: "Generate a complete, structured bias report containing all metrics, AI explanations, group breakdowns, recommendations, and timestamps. Reports are exported as JSON for developer integration or Markdown for executive stakeholder communication. Designed to be included in model cards, compliance packages, and pre-deployment checklists.",
    bullets: [
      "JSON export with all raw metric values and group details",
      "Markdown report with formatted explanations and recommendations",
      "Unique run ID for audit trail and reproducibility",
      "One-click browser download with automatic filename generation",
    ],
    tag: "Export",
  },
  {
    id: 7,
    icon: <Zap className="w-8 h-8" />,
    color: "from-yellow-500 to-orange-500",
    title: "Explainable AI (XAI)",
    subtitle: "SHAP-based feature importance for bias sources",
    desc: "Understanding which dataset features are driving biased decisions is critical for targeted remediation. FairAI's XAI module uses SHAP (SHapley Additive exPlanations) values to identify the top features contributing to fairness metric violations, allowing data scientists to surgically address bias at its source rather than applying blanket mitigations.",
    bullets: [
      "Global SHAP importance charts identifying top bias-driving features",
      "Local SHAP waterfall charts per sample explaining individual model decisions",
      "Proxy feature detection — finding correlated features encoding protected attributes",
      "Interactive feature filtering to simulate removing potential proxy variables",
    ],
    tag: "Advanced AI",
  },
  {
    id: 8,
    icon: <Activity className="w-8 h-8" />,
    color: "from-teal-500 to-emerald-500",
    title: "Real-Time Bias Mitigation Mode",
    subtitle: "Live feedback loop as you apply fixes",
    desc: "FairAI provides a live mitigation simulation mode where you can apply common debiasing techniques and immediately see how your fairness metrics respond. This closed-loop environment allows data scientists to experiment with reweighing, threshold calibration, and feature removal without retraining, dramatically accelerating the debiasing iteration cycle.",
    bullets: [
      "Simulated reweighing with live metric recalculation",
      "Threshold optimization slider showing fairness-accuracy tradeoff curves",
      "Feature masking simulator to measure proxy variable impact",
      "Side-by-side before/after metric comparison panels",
    ],
    tag: "Interactive",
  },
  {
    id: 9,
    icon: <Lock className="w-8 h-8" />,
    color: "from-slate-500 to-gray-600",
    title: "PII Data Anonymization",
    subtitle: "Privacy-preserving preprocessing pipeline",
    desc: "Before any dataset reaches the bias analysis engine, FairAI can scan for and anonymize personally identifiable information including names, email addresses, phone numbers, and national ID formats. This ensures that compliance teams can safely share datasets with analysts without violating GDPR or HIPAA data protection requirements.",
    bullets: [
      "Automatic PII detection using regex and NLP entity recognition",
      "Hash-based pseudonymization preserving data utility for analysis",
      "GDPR Article 25 (data protection by design) compliant preprocessing",
      "Audit log of all masking operations for compliance documentation",
    ],
    tag: "Privacy",
  },
  {
    id: 10,
    icon: <Layers className="w-8 h-8" />,
    color: "from-fuchsia-500 to-pink-500",
    title: "Intersectionality Analysis",
    subtitle: "Multi-attribute compound bias detection",
    desc: "The most severe forms of discrimination often occur at the intersection of multiple protected attributes — for example, Black women may face compounded disadvantage that cannot be captured by analyzing either gender or race independently. FairAI's intersectionality engine computes fairness metrics for every combination of protected attributes in your dataset.",
    bullets: [
      "Automatic generation and evaluation of all attribute interaction pairs",
      "Heatmap visualization of intersectional bias severity levels",
      "Subgroup fairness analysis using Facebook's Fairness Indicators",
      "Compound group identification: e.g. Female+Low-Income+Rural",
    ],
    tag: "Advanced",
  },
  {
    id: 11,
    icon: <Cpu className="w-8 h-8" />,
    color: "from-blue-600 to-indigo-600",
    title: "Synthetic Minority Oversampling",
    subtitle: "AI-driven data augmentation for underrepresented groups",
    desc: "When training data severely underrepresents certain demographic groups, even the best bias mitigation strategies struggle. FairAI's synthetic data generation module uses CTGAN and conditional VAE models to generate statistically realistic synthetic samples for minority groups, increasing representation while preserving the original feature covariance structure.",
    bullets: [
      "CTGAN-based synthetic tabular data generation for minority classes",
      "Feature distribution validation comparing original vs synthetic samples",
      "Configurable oversampling ratio with fairness metric preview",
      "Export augmented dataset as new CSV for model retraining",
    ],
    tag: "Data Engineering",
  },
  {
    id: 12,
    icon: <Network className="w-8 h-8" />,
    color: "from-purple-600 to-indigo-600",
    title: "Multi-Model Framework Support",
    subtitle: "Native connectors for all major ML libraries",
    desc: "FairAI works with your existing ML pipeline regardless of what framework you use. Native connectors are available for scikit-learn, XGBoost, LightGBM, PyTorch, and TensorFlow. Simply pass your trained model and dataset to the FairAI SDK and receive a complete fairness audit without modifying your existing code.",
    bullets: [
      "scikit-learn: direct model object integration via FairaiWrapper",
      "XGBoost & LightGBM: gradient boosted tree support with SHAP integration",
      "PyTorch & TensorFlow: neural network output probability fairness analysis",
      "REST API: language-agnostic endpoint for any model outputting probabilities",
    ],
    tag: "Integration",
  },
  {
    id: 13,
    icon: <Search className="w-8 h-8" />,
    color: "from-cyan-500 to-blue-500",
    title: "Live API Endpoint Auditing",
    subtitle: "Scan live model REST APIs for real-world bias",
    desc: "Production bias often differs from training-time bias due to distribution drift and feedback loops. FairAI's API scanning module intercepts real-world prediction traffic from your deployed model, accumulates sample responses, and periodically computes fairness metrics over rolling 24-hour, 7-day, and 30-day windows to detect emerging bias.",
    bullets: [
      "Webhook integration to passively intercept live API predictions",
      "Rolling window fairness metric computation (24h / 7d / 30d)",
      "Automatic alert trigger when metrics cross configured thresholds",
      "Prometheus and Grafana compatible metric export for existing infra",
    ],
    tag: "DevOps",
  },
  {
    id: 14,
    icon: <Settings className="w-8 h-8" />,
    color: "from-gray-500 to-slate-600",
    title: "Custom Fairness Thresholds",
    subtitle: "Business-specific fairness policy configuration",
    desc: "Different industries have different regulatory requirements for acceptable bias levels. FairAI allows compliance and legal teams to configure custom fairness thresholds that match their specific regulatory environment — stricter thresholds for healthcare and lending, more permissive ones for low-risk applications — and then automatically flags any metrics that breach these policies.",
    bullets: [
      "Per-metric threshold configuration with named policy profiles",
      "Industry presets: Financial, Healthcare, HR, Media, Government",
      "Version-controlled policy configurations with git-style changelog",
      "Automated email/Slack alerts when deployed model breaches thresholds",
    ],
    tag: "Configuration",
  },
  {
    id: 15,
    icon: <Users className="w-8 h-8" />,
    color: "from-orange-500 to-red-500",
    title: "Role-Based Access Control",
    subtitle: "Enterprise granular team permissions",
    desc: "Enterprise AI governance requires different stakeholders to access different parts of the fairness platform. FairAI provides a complete RBAC system with predefined roles for Data Scientists, Compliance Officers, Business Analysts, and C-Suite Executives — each with appropriately scoped access to raw metrics, audit logs, and AI-generated summaries.",
    bullets: [
      "Pre-configured roles: Admin, Data Scientist, Analyst, Compliance Officer",
      "Dataset-level access controls with row-level security",
      "Complete audit log of every action with timestamp and user",
      "SSO integration via OAuth 2.0 and SAML 2.0",
    ],
    tag: "Enterprise",
  },
  {
    id: 16,
    icon: <MessageSquare className="w-8 h-8" />,
    color: "from-sky-500 to-indigo-500",
    title: "NLP Bias Detection",
    subtitle: "Language model and text dataset fairness auditing",
    desc: "Bias in AI extends to language — training corpora, chatbot responses, and resume screens all encode textual biases that traditional tabular fairness tools miss. FairAI's NLP bias module analyzes text datasets and language model outputs for toxic language, demographic representation imbalances, stereotype reinforcement, and sentiment disparities across protected groups.",
    bullets: [
      "Toxicity and sentiment disparity analysis using Perspective API",
      "Demographic word association bias using embedding space geometry",
      "Counterfactual test set generation to measure gendered outcome flips",
      "Representation audit: counts mentions of each protected class in corpus",
    ],
    tag: "NLP",
  },
  {
    id: 17,
    icon: <Fingerprint className="w-8 h-8" />,
    color: "from-stone-500 to-neutral-600",
    title: "Adversarial Debiasing",
    subtitle: "GAN architecture for attribute-agnostic representations",
    desc: "Adversarial debiasing is one of the most powerful in-processing bias mitigation techniques available. FairAI trains an adversarial neural network architecture where a discriminator network tries to predict protected attributes from the main model's intermediate representations, while the main model is trained to fool the discriminator — forcing it to learn representations that are independent of sensitive attributes.",
    bullets: [
      "GAN-based adversarial training loop with configurable fairness-accuracy tradeoff",
      "Works with any continuous or categorical sensitive attribute",
      "Training convergence visualization and diagnostic charts",
      "Pre-trained debiased model export in ONNX, TensorFlow SavedModel, and PyTorch formats",
    ],
    tag: "Advanced ML",
  },
  {
    id: 18,
    icon: <CheckCircle className="w-8 h-8" />,
    color: "from-green-500 to-teal-500",
    title: "Regulatory Compliance Auditing",
    subtitle: "EU AI Act, GDPR, and EEOC compliance tracking",
    desc: "FairAI maintains a compliance audit engine that continuously maps your model's fairness metrics against the specific requirements of major AI regulations. Get instant compliance reports for the EU AI Act's high-risk AI system requirements, GDPR's explainability mandates, EEOC uniform guidelines, and NYC Local Law 144 for automated employment decisions.",
    bullets: [
      "EU AI Act Article 10 compliance: training data quality assessment",
      "GDPR Article 22 compliance: automated decision explainability audit",
      "EEOC Uniform Guidelines §1607: 4/5ths rule documentation",
      "NYC Local Law 144: annual bias audit report generation",
    ],
    tag: "Compliance",
  },
  {
    id: 19,
    icon: <Globe className="w-8 h-8" />,
    color: "from-indigo-500 to-blue-600",
    title: "Historical Fairness Tracking",
    subtitle: "Time-series bias monitoring and drift detection",
    desc: "Model bias is not static — it evolves over time as the world changes, distribution shifts occur, and feedback loops accumulate. FairAI's historical tracking dashboard maintains a time-series record of every fairness metric for every model version, allowing teams to detect bias drift early, correlate metric changes with deployment events, and demonstrate improvement over time to regulators.",
    bullets: [
      "Full historical timeline of all fairness metric values per model version",
      "Configurable drift alert when metrics change by more than a set percentage",
      "Model version comparison: side-by-side fairness diff between v1 and v2",
      "Exportable compliance timeline for regulatory evidence packages",
    ],
    tag: "Monitoring",
  },
  {
    id: 20,
    icon: <Eye className="w-8 h-8" />,
    color: "from-rose-500 to-pink-500",
    title: "Visual Feature Importance",
    subtitle: "Tree-based and permutation importance charts",
    desc: "FairAI provides two complementary feature importance methodologies: tree-based impurity importance for gradient boosted models, and model-agnostic permutation importance for any estimator. Both are visualized as ranked horizontal bar charts that highlight which features are contributing most to the model's predictions — and crucially, which may be acting as proxy discriminators.",
    bullets: [
      "Tree impurity feature importance with Gini coefficient breakdown",
      "Permutation importance with confidence intervals across 10-fold CV",
      "Proxy feature flagging: automatic detection of features correlated with sensitive attributes",
      "Interactive chart with click-to-mask functionality to simulate feature removal",
    ],
    tag: "Interpretability",
  },
];

export default function FeaturesPage() {
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 400);
    }
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      {/* Hero */}
      <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold mb-8 group transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm px-4 py-1.5 rounded-full font-semibold mb-5">
              <Zap className="w-4 h-4" /> Complete Feature Reference
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-indigo-200 to-purple-300 text-transparent bg-clip-text leading-tight mb-5">
              Enterprise Fairness Ecosystem
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
              FairAI covers the full lifecycle of responsible AI—from data profiling to regulatory-grade compliance reporting and ethical governance.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {ALL_FEATURES.map((f) => (
            <a key={f.id} href={`#feature-${f.id}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              {f.id}. {f.title}
            </a>
          ))}
        </div>
      </div>

      {/* Feature Sections */}
      <div className="max-w-6xl mx-auto px-4 pb-32 space-y-32">
        {ALL_FEATURES.map((f, i) => (
          <motion.section
            id={`feature-${f.id}`}
            key={f.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col ${i % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-start`}
          >
            {/* Visual Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`w-full lg:w-1/2 p-1 rounded-3xl bg-gradient-to-br ${f.color} shadow-2xl flex-shrink-0`}
            >
              <div className="w-full bg-slate-950 rounded-[1.4rem] p-10 relative overflow-hidden min-h-[280px] flex flex-col justify-between border border-white/5">
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${f.color} rounded-full blur-3xl opacity-15`} />
                <div>
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${f.color} text-white mb-6 shadow-lg`}>
                    {f.icon}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${f.color} bg-clip-text text-transparent border border-white/10`}>{f.tag}</span>
                    <span className="text-slate-600 text-xs font-mono">F-{f.id < 10 ? "0" + f.id : f.id}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{f.title}</h3>
                  <p className="text-slate-400 mt-2">{f.subtitle}</p>
                </div>
                <div className={`mt-6 text-6xl font-black bg-gradient-to-br ${f.color} bg-clip-text text-transparent opacity-20 select-none`}>
                  {f.id < 10 ? "0" + f.id : f.id}
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <div className="w-full lg:w-1/2">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 bg-gradient-to-r ${f.color} bg-clip-text text-transparent border border-white/10`}>
                FEATURE {f.id < 10 ? "0" + f.id : f.id} of 20
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">{f.title}</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">{f.desc}</p>
              <ul className="space-y-3 mb-8">
                {f.bullets.map((b, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + j * 0.08 }}
                    className="flex items-start gap-3 text-slate-400"
                  >
                    <CheckCircle className={`w-4 h-4 text-emerald-400 mt-0.5 shrink-0`} />
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="flex gap-3 flex-wrap">
                <Link href="/upload" className={`px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r ${f.color} text-white shadow-lg hover:scale-105 transition-transform`}>
                  Try It Now →
                </Link>
                <Link href="/dashboard" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all">
                  See Live Demo
                </Link>
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-white/5 py-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to detect bias in your model?</h2>
          <p className="text-slate-400 text-lg mb-10">Upload your dataset or run a demo to see all 20 features in action.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-2xl shadow-indigo-500/25">
              Upload Dataset
            </Link>
            <Link href="/dashboard" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all">
              Open Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
