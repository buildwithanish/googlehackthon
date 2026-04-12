# ⚖️ FairAI – Detecting Bias in Automated Decision Systems

> **Google Build with AI – Solution Challenge 2026** · Detect. Explain. Mitigate.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?style=flat&logo=next.js)](https://nextjs.org)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
[![Fairlearn](https://img.shields.io/badge/ML-Fairlearn-FF6B6B?style=flat)](https://fairlearn.org)

FairAI is a full-stack platform that **detects bias in machine learning datasets**, computes fairness metrics, and generates **AI-powered explanations and mitigation strategies** using Google Gemini — wrapped in a beautiful Next.js dashboard.

---

## 🏗️ System Architecture

```
fairai/
├── backend/                  ← FastAPI REST API
│   ├── main.py               ← All API endpoints
│   └── __init__.py
├── bias_detection/           ← Core ML fairness engine
│   ├── metrics.py            ← Fairlearn metrics computation
│   └── ai_explainer.py       ← Google Gemini integration
├── dashboard/                ← Reporting utilities
│   ├── visualizations.py     ← Plotly chart functions
│   └── reporting.py          ← PDF/Markdown report generation
├── frontend/                 ← Next.js React app
│   ├── app/
│   │   ├── page.tsx          ← Home page
│   │   ├── upload/page.tsx   ← Dataset upload
│   │   ├── dashboard/page.tsx← Fairness dashboard
│   │   ├── metrics/page.tsx  ← Metrics reference
│   │   └── report/page.tsx   ← AI report page
│   ├── components/Navbar.tsx
│   ├── lib/api.ts            ← API utilities
│   └── package.json
├── app.py                    ← Streamlit dashboard (alternative UI)
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📂 **Dataset Upload** | Drag & drop CSV upload with instant column detection |
| 🔍 **Bias Detection** | Demographic Parity, Equal Opportunity, Disparate Impact |
| 📊 **Fairness Dashboard** | Gauge, Radar, Bar, Pie charts with Recharts |
| 🤖 **Gemini AI** | Plain-language bias explanation + 5 mitigation strategies |
| 📄 **Report Export** | Markdown, JSON, and Print-ready reports |
| 🌐 **REST API** | Full FastAPI backend for programmatic access |
| 🖥️ **Streamlit UI** | Alternative Streamlit dashboard for rapid prototyping |

---

## 🚀 Quick Start (Local Dev)

### Prerequisites
- Python 3.9+
- Node.js 18+
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) (free)

### 1. Clone & Install Backend
```bash
git clone https://github.com/your-username/fairai.git
cd fairai

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Set Environment Variables
```bash
# Windows
set GEMINI_API_KEY=your_api_key_here

# macOS/Linux
export GEMINI_API_KEY=your_api_key_here
```

### 3. Start the Backend (FastAPI)
```bash
uvicorn backend.main:app --reload --port 8000
```
→ API docs at http://localhost:8000/docs

### 4. OR Run Streamlit Dashboard
```bash
streamlit run app.py
```
→ Open http://localhost:8501

### 5. Start the Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
→ Open http://localhost:3000

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Landing page |
| `GET` | `/health` | Health check |
| `POST` | `/upload_dataset` | Upload CSV + get preview/metadata |
| `POST` | `/analyze_bias` | Compute all fairness metrics |
| `GET` | `/fairness_metrics` | Get metric descriptions & thresholds |
| `POST` | `/generate_ai_explanation` | Full analysis + Gemini AI explainer |
| `POST` | `/bias_report` | Download JSON or Markdown report |

### Example: Analyze Bias
```bash
curl -X POST "http://localhost:8000/analyze_bias" \
  -F "file=@dataset.csv" \
  -F "target_col=income" \
  -F "sensitive_col=gender"
```

### Example: AI Explanation
```bash
curl -X POST "http://localhost:8000/generate_ai_explanation" \
  -F "file=@dataset.csv" \
  -F "target_col=income" \
  -F "sensitive_col=gender" \
  -F "gemini_api_key=AIzaSy..."
```

---

## 🧠 Fairness Metrics

| Metric | Ideal | Threshold | Tool |
|--------|-------|-----------|------|
| Demographic Parity Difference | 0.0 | ≤ 0.1 | Fairlearn |
| Equalized Odds Difference | 0.0 | ≤ 0.1 | Fairlearn |
| Disparate Impact Ratio | 1.0 | ≥ 0.8 (80% Rule) | Custom |
| Overall Fairness Score | 100 | ≥ 80 | Composite |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Charts | Recharts (Bar, Radar, Pie, Gauge) |
| Backend | Python, FastAPI, Uvicorn |
| ML/Fairness | Scikit-learn, Fairlearn, Pandas, NumPy |
| AI | Google Gemini 1.5 Flash |
| Reports | FPDF2 (PDF), Markdown |
| Deployment | Vercel (frontend), Render/Railway/GCR (backend) |
| Containers | Docker, Docker Compose |

---

## ☁️ Deployment

### Frontend → Vercel (Recommended)
```bash
cd frontend
npx vercel --prod
# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
```

### Backend → Render
1. Connect your GitHub repo at [render.com](https://render.com)
2. Create a new **Web Service**
3. Set:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - Environment variable: `GEMINI_API_KEY=your_key`

### Backend → Google Cloud Run
```bash
gcloud run deploy fairai-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY=your_key \
  --allow-unauthenticated
```

### Full Stack → Docker Compose
```bash
# Copy .env.example to .env and set your Gemini key
cp .env.example .env

docker compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# Streamlit: http://localhost:8501
```

---

## 📊 Sample Dataset

A synthetic **Adult Income Dataset** (1,000 rows) is built into both UIs.
It intentionally includes gender-based income bias to demonstrate the platform's detection capabilities.

Click **"Load Sample Dataset"** in the upload sidebar to test without a real dataset.

---

## 🎯 Use Cases

- **Hiring Systems**: Detect gender/race bias in resume screening
- **Loan Approvals**: Audit credit scoring for discrimination
- **Healthcare**: Identify disparities in treatment recommendations
- **Education**: Analyse fairness in admission algorithms

---

## 📄 License

MIT License – Free to use, modify, and distribute.

---

*Built with ❤️ for Google AI Solution Challenge 2026 · FairAI Team*
