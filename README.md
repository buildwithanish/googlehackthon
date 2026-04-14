# ⚖️ FairAI – Bias Detection Platform

### **Empowering Ethical AI through Mathematical Transparency**
#### **Developed by Anish | Team Synapse Squad Hub**
#### *Official Submission for the Google Solution Challenge 2026*

---

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)
[![Google Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini)](https://deepmind.google/technologies/gemini/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Open Source](https://img.shields.io/badge/Open%20Source-MIT-emerald?style=for-the-badge&logo=github)](https://opensource.org/licenses/MIT)

---

## 🌟 Project Description

Bias in AI is no longer just a technical glitch; it's a systemic failure. As machine learning models increasingly automate critical life decisions—from **loan approvals** and **hiring** to **healthcare treatments**—they often inherit and amplify historical societal prejudices found in training data.

**FairAI** is a state-of-the-art governance platform designed to detect, visualize, and remediate these biases. By combining rigorous fairness metrics with the intelligence of **Google Gemini AI**, FairAI provides institutional-grade transparency, ensuring that automated systems are not just accurate, but **fair and equitable**.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **🔍 Bias Detection Engine** | Automated profiling of datasets using Fairlearn and AIF360 frameworks. |
| **📈 Fairness Metrics** | Real-time calculation of Demographic Parity, Equalized Odds, and Disparate Impact. |
| **🌡️ Bias Heatmap** | High-fidelity visualizations identifying disparity clusters across demographics. |
| **🖇️ Intersectional Bias** | Detection of compounded disparities (e.g., Age + Gender) that traditional audits miss. |
| **🧠 Explainable AI (SHAP)** | Local and global feature importance analysis to identify proxy discrimination. |
| **🤖 AI Bias Explanation** | Human-readable narratives and remediation roadmaps powered by **Gemini 1.5 Pro**. |
| **🎮 Live Bias Simulator** | Interactive environment to generate and stress-test synthetic biased datasets. |
| **📄 Professional Exports** | Automated generation of **PDF Audit Reports** and **PowerPoint Presentations**. |
| **🎙️ Voice Assistant** | Hands-free governance via an offline-capable Web Speech AI assistant. |
| **🖥️ Interactive Dashboard** | A premium "Governance Console" aesthetic built with glassmorphism design. |

---

## 🎥 Live Demo

### **[Watch the Demo Video](https://youtube.com/placeholder)**

**Demo Flow:**
1. **Upload**: User uploads a dataset (e.g., Loan Approval records).
2. **Configure**: Select sensitive attributes (Gender, Race, Age) and the target outcome.
3. **Analyze**: The engine computes fairness metrics and generates a "Fairness Score".
4. **Insight**: Gemini AI explains the bias patterns in plain language.
5. **Mitigation**: The platform suggests specific algorithms (Reweighing, Adversarial Debiasing) to fix the bias.

---

## 🖼️ Screenshots

> **Note:** Screenshots coming soon!

| | |
| :---: | :---: |
| ![Landing Page](https://via.placeholder.com/800x450?text=FairAI+Landing+Page) <br> *Landing Page* | ![Bias Dashboard](https://via.placeholder.com/800x450?text=FairAI+Governance+Dashboard) <br> *Governance Dashboard* |
| ![Fairness Metrics](https://via.placeholder.com/800x450?text=FairAI+Fairness+Metrics) <br> *Metric Visualization* | ![Bias Simulator](https://via.placeholder.com/800x450?text=FairAI+Live+Bias+Simulator) <br> *Live Bias Simulator* |

---

## 🏗️ System Architecture

FairAI follows a modular microservices-inspired architecture:

- **Frontend**: A high-performance Next.js 14 client that handles complex visualizations and client-side processing.
- **Backend API**: A robust FastAPI service that serves as the primary engine for metric computation and report generation.
- **ML Engine**: Leverages `Fairlearn` and `AIF360` for core fairness algorithms and `SHAP` for explainability.
- **AI Module**: Integrates **Google Gemini 1.5 Pro** for generating contextual bias narratives.
- **Pipeline**: Ensures seamless data flow: `Upload -> Profile -> Analyze -> Explain -> Export`.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Antigravity Design System)
- **UI Library**: Framer Motion, Lucide Icons, Shadcn UI
- **Charts**: Recharts (High-fidelity data viz)

### **Backend**
- **Framework**: FastAPI (Python 3.10+)
- **WSGI/ASGI**: Uvicorn
- **Documentation**: Swagger/OpenAPI

### **Machine Learning**
- **Algorithms**: Scikit-Learn
- **Fairness**: Microsoft Fairlearn, IBM AIF360
- **Explainability**: SHAP (Shapley Additive Explanations)
- **Data**: Pandas, NumPy

### **AI Integration**
- **Engine**: Google Gemini AI (Vertex AI Simulation)
- **Logic**: Prompt Engineering for Remediation Roadmaps

### **Deployment**
- **Frontend**: Vercel
- **Backend**: Render / Railway
- **Storage**: In-memory (Privacy-first data sovereignty)

---

## 📂 Project Structure

```text
fairai-project/
├── frontend/             # Next.js 14 Web Interface
│   ├── app/              # Governance & Simulator Pages
│   ├── components/       # VoiceAssistant & UI Components
│   └── lib/              # Report Generation Logic
├── backend/              # FastAPI Modular Engine
│   ├── main.py           # API Gateway
│   ├── report_engine.py  # PDF/PPT Export Pipeline
├── bias_detection/       # Core Fairness Logic
│   ├── metrics.py        # Fairlearn/AIF360 Wrappers
│   └── ai_explainer.py   # Gemini AI Integration
├── datasets/             # Sample Governance Scenarios
└── README.md             # Project Documentation
```

---

## ⚙️ Installation Guide

### **1. Clone the Repository**
```bash
git clone https://github.com/buildwithanish/googlehackthon.git
cd googlehackthon
```

### **2. Setup Backend**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Start backend
uvicorn backend.main:app --reload --port 8000
```

### **3. Setup Frontend**
```bash
cd frontend
npm install

# Create .env.local and add your API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

---

## 💡 Usage

1. **Upload Dataset**: Drag and drop your CSV dataset into the Audit Panel.
2. **Run Demo Analysis**: Use the "Shuffle" button to test unique pre-computed scenarios.
3. **View Metrics**: Analyze the Fairness Score, Disparate Impact, and Intersectional Matrix.
4. **Download Report**: Generate a "Zero-Config" PDF Audit for your compliance team.

---

## 🎮 Live Bias Simulator

The **Live Bias Simulator** allows developers to generate synthetic datasets with adjustable bias parameters. Use the sliders to control:
- **Gender Disparity**
- **Income Skewness**
- **Age Discrimination**

Generate the data, visualize the resulting bias in real-time, and download the CSV to train "Bias-Aware" ML models.

---

## 🎙️ Voice Assistant

FairAI features an **Offline Voice Assistant** for hands-free dashboard control.
**Try saying:**
- *"Run demo analysis"* — Shuffles to a new audit scenario.
- *"Show fairness score"* — Focuses the view on the primary gauge.
- *"Download report"* — Initiates the PDF audit export.

---

## 🗺️ Roadmap

- [ ] **Real-time Monitoring**: API hooks for live production model monitoring.
- [ ] **Enterprise Integration**: Native connectors for AWS SageMaker and Google Vertex AI.
- [ ] **Auto-Mitigation**: One-click bias correction using adversarial debiasing.

---

## 🤝 Contribution

We welcome contributions from the ethical AI community! 
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🏆 Developed by

**Anish**  
*Lead Developer & AI Architect*  
[GitHub](https://github.com/buildwithanish) | [LinkedIn](https://linkedin.com/in/anish)

**Team Synapse Squad Hub**  
*Building Technology for Equity*

**Built for the Google Solution Challenge 2026.**

---

![FairAI Banner](https://via.placeholder.com/1200x300?text=FairAI+-+Building+the+Future+of+Ethical+AI)

## ⭐ Star the repository if you like this project!
