# FairAI — Enterprise-Grade Bias Detection & AI Governance Platform

![FairAI Banner](https://img.shields.io/badge/FairAI-Enterprise--Ready-indigo?style=for-the-badge&logo=googlecloud&logoColor=white)
![Google Cloud](https://img.shields.io/badge/Built%20With-Google%20Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5%20Pro-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

**FairAI** is a production-grade governance platform designed to detect, analyze, and mitigate bias in machine learning datasets and automated decision-making systems. Built for the **Google Solution Challenge 2026**, it leverages Google Cloud's robust infrastructure and Gemini AI to provide regulatory-grade transparency and ethical AI oversight.

---

## 🚀 Key Features

### 1. **Dynamic Bias Profiling**
- **Automated Scanning**: Upload any CSV dataset to instantly identify bias across protected attributes (Gender, Age, Race, Location).
- **Comprehensive Metrics**: Real-time calculation of **Demographic Parity**, **Equalized Odds**, and **Disparate Impact Ratio**.

### 2. **Gemini-Powered AI Explainer**
- **Root Cause Analysis**: Context-aware explanations of *why* bias exists in your data.
- **Remediation Roadmap**: Step-by-step mitigation strategies (Reweighing, Adversarial Debiasing, Calibrated Equal Odds) generated specifically for your scenario.

### 3. **Enterprise Compliance Reporting**
- **Regulatory-Ready Exports**: Generate professional **PDF Audit Reports**, **Word Documentation**, and **PowerPoint Slides** for executive stakeholders.
- **Fail-Safe Processing**: Hybrid cloud failover mechanism ensures the platform remains operational even during high-traffic periods.

### 4. **Modern Visualization Dashboard**
- **High-Fidelity Charts**: Interactive Recharts-powered distribution analysis and fairness scoring.
- **Scenario Simulation**: Test your governance logic with built-in industry scenarios (Hiring Bias, Loan Approval, Healthcare Equity).

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS & Framer Motion (Glassmorphism UI)
- **Visualization**: Recharts & Lucide Icons
- **Reporting**: jsPDF & docx.js

### **Cloud & AI (Google Solution Challenge Integration)**
- **Google Cloud Run**: Scalable containerized deployment.
- **Google Gemini 1.5 Pro**: Advanced LLM for bias explanation and remediation strategies.
- **Google Vertex AI**: Future-ready pipeline integration for large-scale model auditing.

### **Backend**
- **FastAPI**: High-performance Python backend.
- **Data Science**: Fairlearn, Scikit-learn, Pandas, NumPy.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Google Cloud Project with Gemini API enabled.

### 1. Clone the Repository
```bash
git clone https://github.com/buildwithanish/googlehackthon.git
cd googlehackthon
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Add your NEXT_PUBLIC_API_URL and GEMINI_API_KEY
npm run dev
```

### 3. Backend Setup
```bash
cd ..
# Create a virtual environment
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```

---

## 📈 Roadmap
- [ ] **NextAuth Integration**: Secure user-specific audit histories.
- [ ] **Vertex AI Pipeline**: Real-time monitoring of live prediction endpoints.
- [ ] **Global Bias Benchmarks**: Compare your model against industry-standard fairness datasets.

---

## 🛡️ License & Credits
Developed by **AnishNova Technologies** for the **Google Solution Challenge 2026**.
Powered by **Google Gemini** and **Cloud Infrastructure**.

---

### **Contact**
For enterprise inquiries or collaboration:  
📧 **Email**: buildwithanish@example.com  
🌐 **Website**: [FairAI Enterprise](https://fairai.anishnova.tech)
