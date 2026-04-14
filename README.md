# FairAI — Enterprise-Grade Bias Detection & AI Governance
### Developed by Team Synapse Squad Hub | AnishNova Technologies

![FairAI Banner](https://img.shields.io/badge/FairAI-Hackathon--Winner-indigo?style=for-the-badge&logo=googlecloud&logoColor=white)
![Google Cloud](https://img.shields.io/badge/Built%20With-Google%20Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5%20Pro-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

**FairAI** is a state-of-the-art AI Governance & Fairness platform built for the **Google Solution Challenge 2026**. It provides institutional-grade transparency for machine learning systems, ensuring that automated decisions are fair, ethical, and legally compliant.

---

## 🏗️ Project Structure

```text
.
├── frontend/               # Next.js 14 + Tailwind (Governance Interface)
│   ├── app/                # App router pages (Audit, Dashboard, Upload)
│   ├── components/         # Recharts Visuals & Framer Motion UI
│   ├── lib/                # Professional PDF/Word/PPT Generators
│   └── public/             # Marketing assets & Branding
├── backend/                # FastAPI Modular Core
│   ├── main.py             # API Gateway
│   ├── aif360_analysis.py  # IBM AIF360 Metrics
│   └── fairlearn_analysis.py# Microsoft Fairlearn Engine
├── datasets/               # Professional Sample Scenarios
├── ARCHITECTURE.md         # Deep-dive tech specifications
├── app.py                  # Monolithic API Entry (for Cloud Run)
├── Dockerfile              # Containerization for Google Cloud
└── requirements.txt        # Python dependency manifest
```

---

## 🛠️ Core Technology Stack

- **Frontend Architecture**: 
  - **Next.js 14** (App Router) for blazing fast SSR.
  - **TailwindCSS** for a custom "Antigravity" glassmorphism design system.
  - **Recharts** for mathematically accurate fairness distributions.
- **AI Intelligence Layer**:
  - **Google Gemini 1.5 Pro** for context-aware bias narratives and remediation roadmaps.
  - **Vertex AI Simulation** for failover processing logic.
- **Fairness Frameworks**:
  - **Microsoft Fairlearn** for Demographic Parity and Equalized Odds.
  - **IBM AIF360** for Disparate Impact and Individual Fairness metrics.
- **Backend Infrastructure**:
  - **FastAPI** (Python 3.10+) for high-concurrency numeric processing.

---

## 🚀 Installation & Deployment

### **Backend Setup**
1. Install dependencies: `pip install -r requirements.txt`
2. Run server: `uvicorn app:app --reload --port 8000`

### **Frontend Setup**
1. Install: `cd frontend && npm install`
2. Environment: Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. Launch: `npm run dev`

---

## 🏆 The Team: Synapse Squad Hub
Dedicated to building technology that serves humanity through transparency.

- **Anish Raj** (Project Lead / AI Architect)
- **Subham Sharma** (Backend & Data Pipelines) 
- **Amrit Anand** (Frontend & UX Design)
- **Kapil Vishwakarma** (Ethics & Compliance Analyst)

---

**AnishNova Technologies** | *Building the Future of Ethical AI*
