# ⚖️ FairAI – System Architecture & Demo Setup
> **Google Build with AI – Solution Challenge 2026** · Advanced AI Governance Platform

![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/API-Render-black?logo=render)
![Python](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)

FairAI is an enterprise-grade AI governance platform. It detects intersectional bias, calculates disparate impact, provides a centralized Model Registry, and uses LLMs to automate mitigations.

## 🚀 Features & Modules

### 1️⃣ AI Governance Platform (V3)
- Models Sandbox & Version Tracking.
- Policy Management with European Union AI Act and NYC Local Law 144 templates.
- **Enterprise Risk Scorecard:** 6-axis radar evaluating diversity, transparency, and readiness.

### 2️⃣ Continuous Monitoring
- Real-Time Fairness Drift Detection graphs.
- Monitoring tags for Pipeline Failure & Imbalance severity warnings.
- Dataset shift tracking.

### 3️⃣ Enterprise Bias Detection
- Evaluates Demographic Parity, Equal Opportunity, and the Disparate Impact (80% rule).
- Handles edge-cases for Recommender Systems, Hiring platforms, and Loan Systems.

### 4️⃣ LLM Explainable AI (Google Gemini 1.5)
- **Deep Explainer:** Converts abstract matrix metrics to a Human-readable summary.
- Recommended automated debugging tasks targeted at root cause (e.g. Adversarial Debiasing limits).

---

## 📁 System Architecture
```
fairai/
├── backend/                  ← FastAPI REST API Core
├── bias_detection/           ← Fairlearn Metrics Logic Engine
├── dashboard/                ← Enterprise Visualization Hub
├── datasets/                 ← Demo Bias Datasets (Hiring, Healthcare, Loans)
├── frontend/                 ← Next.js 14 Web App + Tailwind UI
├── scripts/                  ← Setup & Dataset generation automation routines
```

## 🎮 Demo Mode Details
We have included three intentionally biased datasets specifically built to demonstrate the FairAI warning system in action.
- **`hiring_dataset.csv`**: Demonstrates age & gender bias (Older women significantly discriminated against in predictions).
- **`loan_dataset.csv`**: Highlights income disparities combined with employment status.
- **`healthcare_dataset.csv`**: Shows discrimination regarding severe disease treatment recommendations.

**To Run Demo Mode:**
1. Navigate to the `Upload Dataset` page.
2. Under "Try Demo Mode", click **Run Demo Analysis** on any card.
3. Automatically simulates pipeline analysis onto the visual dashboard.

---

## ⚙️ Deployment Instructions

### Frontend (Next.js / Vercel)
1. Import the `/frontend` root via Vercel.
2. Add Environmental Parameters:
   - `NEXT_PUBLIC_GEMINI_API_KEY`
   - `NEXT_PUBLIC_API_URL` (Points to Render deployment)
3. Deploy!

### Backend (FastAPI / Render)
1. Import Git Repo to Render.com -> Select Web Service.
2. Build Settings:
   - Language: **Docker**
   - Health Check Path: `/health`
   - Advanced: Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
3. Link `GEMINI_API_KEY` inside Render settings.

---

*Winner Candidate 2026 – Ethical Bias Detection Platform Initiative*
