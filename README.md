# ⚖️ FairAI – Bias Detection Platform

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend-Render-46e3b7?logo=render)](https://render.com)
[![Python](https://img.shields.io/badge/API-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/UI-Next.js%2014-black?logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

> **Google Solution Challenge 2026** | Developed by **Anish** | Team **Synapse Squad Hub**

FairAI is a production-ready AI bias detection and fairness auditing platform. It detects bias in ML datasets using Microsoft Fairlearn and IBM AIF360, explains results using Google Gemini AI, and presents actionable mitigation strategies on a modern SaaS dashboard.

---

## Problem Statement

> *"Unbiased AI Decision – Ensuring fairness and detecting bias in automated decision systems."*

AI systems used in loan approvals, hiring, healthcare, and insurance are trained on historical data that encodes human biases. FairAI gives developers and compliance teams the tools to measure, visualize, and fix these biases before deployment.

---

## Features

| Feature | Description |
|---------|-------------|
| **Dataset Upload** | Upload any CSV dataset for immediate bias analysis |
| **Demo Mode** | One-click demo with pre-built biased datasets |
| **5 Fairness Metrics** | Demographic Parity, Equal Opportunity, Disparate Impact, Equalized Odds, Fairness Score |
| **Fairness Gauge** | Speedometer-style indicator (Green/Yellow/Red) |
| **AI Bias Explanation** | Google Gemini generates plain-language explanations |
| **Mitigation Playbook** | 5 actionable strategies with impact/effort ratings |
| **PDF/JSON Report** | Downloadable compliance audit report |
| **3 Demo Datasets** | Loan, Hiring, Healthcare with intentional bias patterns |

---

## Project Structure

```
fairai/
├── backend/                   ← FastAPI REST API
│   ├── main.py                ← All API endpoints
│   ├── aif360_analysis.py     ← IBM AIF360 integration
│   ├── fairlearn_analysis.py  ← Microsoft Fairlearn integration
│   └── report_generator.py   ← Markdown + JSON report generation
│
├── bias_detection/            ← Core ML pipeline
│   ├── metrics.py             ← Fairness metric calculations
│   └── ai_explainer.py        ← Gemini API integration
│
├── frontend/                  ← Next.js 14 web application
│   ├── app/
│   │   ├── page.tsx           ← Landing page (dark hero + live demo)
│   │   ├── upload/page.tsx    ← Dataset upload + demo mode
│   │   ├── dashboard/page.tsx ← Bias dashboard with gauge + charts
│   │   ├── metrics/page.tsx   ← Fairness metrics reference
│   │   └── report/page.tsx    ← AI bias report + download
│   └── components/
│       ├── Navbar.tsx
│       └── Footer.tsx
│
├── datasets/                  ← Demo datasets
│   ├── demo_dataset.csv       ← 5,000 rows (loan approvals with gender bias)
│   ├── hiring_dataset.csv     ← 500 rows (hiring bias)
│   └── healthcare_dataset.csv ← 500 rows (healthcare disparities)
│
├── generate_demo_dataset.py   ← Dataset generator (generates up to 1 crore rows)
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

---

## Demo Mode

### Quick Demo (No Upload Required)
1. Visit your deployed Vercel URL
2. Click **"Run Demo Analysis"** on the landing page or upload page
3. The dashboard loads instantly with real bias metrics and AI explanation

### Demo Datasets Included

| Dataset | Rows | Bias Type | Target Column | Sensitive Column |
|---------|------|-----------|--------------|-----------------|
| `demo_dataset.csv` | 5,000 | Gender + Income bias in loans | `loan_approved` | `gender` |
| `hiring_dataset.csv` | 500 | Age & Gender in hiring | `hired` | `gender` |
| `healthcare_dataset.csv` | 500 | Demographic treatment gaps | `outcome` | `gender` |

**Bias statistics from demo_dataset.csv:**
- Male approval rate: **40.4%**
- Female approval rate: **31.8%**
- Non-Binary approval rate: **24.8%**
- Disparate Impact: **~0.61** (fails EEOC 80% rule)

---

## Generate Large Dataset (1 Crore Rows)

```bash
# Small demo dataset (5,000 rows) — already included
python generate_demo_dataset.py

# Large dataset (10,000,000 rows = 1 crore)
python generate_demo_dataset.py --large

# Custom size
python generate_demo_dataset.py --rows 100000
```

---

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/buildwithanish/googlehackthon.git
cd googlehackthon

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start backend
uvicorn backend.main:app --reload --port 8000
# API docs: http://localhost:8000/docs
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.local.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_GEMINI_API_KEY=your_key_here

# Start development server
npm run dev
# App: http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/demo_dataset` | Download sample CSV |
| `POST` | `/upload_dataset` | Upload and preview CSV |
| `POST` | `/analyze_bias` | Run fairness analysis |
| `GET` | `/fairness_metrics` | Metric definitions |
| `POST` | `/generate_ai_explanation` | Gemini AI explanation |
| `POST` | `/bias_report` | Download report (JSON/MD) |

**Swagger Docs:** `https://your-backend.onrender.com/docs`

---

## Deployment

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import `googlehackthon`
2. Set **Root Directory** to `frontend`
3. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
   ```
4. Deploy!

### Backend → Render

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check:** `/health`
4. Add Environment Variable: `GEMINI_API_KEY=your_key`
5. Deploy!

---

## Fairness Metrics Explained

| Metric | Ideal | Threshold | Legal Reference |
|--------|-------|-----------|----------------|
| Fairness Score | 100 | ≥ 80 | Composite index |
| Demographic Parity Difference | 0.0 | ≤ 0.10 | CFPB Fair Lending |
| Equalized Odds Difference | 0.0 | ≤ 0.10 | CFPB Fair Lending |
| Disparate Impact Ratio | 1.0 | ≥ 0.80 | EEOC 4/5ths Rule |

---

## Team

| Role | Name |
|------|------|
| Lead Developer & AI Engineer | **Anish** |
| Hackathon Team | **Synapse Squad Hub** |
| Challenge | Google Solution Challenge 2026 |

---

*FairAI v2.0 | MIT License | Developed by Anish | Team Synapse Squad Hub*
