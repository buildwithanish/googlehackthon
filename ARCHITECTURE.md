# FairAI: Responsible AI Governance Platform
**System Architecture & Technical Design**

## 1. High-Level Enterprise Architecture

```mermaid
graph TD
    %% User Layer
    U[Decision Makers & Auditors] <-->|Web & Mobile UI| F[Next.js + Tailwind Dashboard]
    U2[Data Scientists] <-->|REST / Swagger| A
    
    %% Application Layer
    subgraph Frontend Cloud (Vercel)
        F
    end
    
    subgraph API Layer (FastAPI)
        A[FastAPI Core Server]
        R[Router & Authentication]
        A --> R
    end
    
    F <-->|HTTPS / JSON| A
    
    %% Engine Layer
    subgraph Assessment Engines
        BD[Bias Detection Engine]
        FM[Fairlearn Metrics Engine]
        XAI[Gemini XAI Explainer]
        RM[Monitoring & Alerts Module]
        
        R --> BD
        R --> FM
        R --> XAI
        R --> RM
    end
    
    %% Platform Services
    XAI <--> |gRPC| G[Google Gemini API]
    
    %% Data Layer
    subgraph Data Layer
        DB[(Cloud Postgres SQL)]
        D[Demo Datasets: Hiring, Loan, Healthcare]
        DB -.->|Logs & Audit| RM
        BD <--> D
    end

    style F fill:#000,stroke:#333,stroke-width:2px,color:#fff
    style A fill:#009688,stroke:#333,stroke-width:2px,color:#fff
    style G fill:#4285F4,stroke:#333,stroke-width:2px,color:#fff
    style BD fill:#FF6B6B,stroke:#333,stroke-width:2px,color:#fff
```

## 2. Platform Modules Architecture

### 🛡️ Enterprise AI Governance
Serves as the control plane for model policies and registry.
- **Model Registry System:** Keeps track of model hashes, endpoints, and deployment context.
- **Approval Workflow:** Models cannot be moved to production if the `Disparate Impact` is $< 0.8$.
- **AI Risk Scorecard:** Proprietary 6-axis framework evaluating Transparency, Ethics, Robustness, Accountability, Compliance, and Drift.

### 🌐 Responsible AI Monitoring
- **Real-Time Hook:** Intercepts batches of live inference data to calculate fairness drift over time.
- **Automated Alerts:** If the Demographic Parity difference exceeds $0.15$, an automatic Slack / Email alert is triggered via the Alert Manager.
- **Heatmaps:** A cross-demographic correlation map pinpointing where intersectional bias occurs (e.g. Older + Female).

### 📖 LLM-Powered XAI (Explainable AI)
- **Deep Insight Generation:** Bridges the gap between Data Scientists and Legal teams by interpreting raw mathematical matrices into understandable text via Google Gemini.
- **Remediation Engine:** Autonomously suggests ML mitigation techniques (e.g., Reweighting, Adversarial Debiasing, Threshold Optimization) based on the identified bias type.

## 3. Technology Stack Breakdown

| Category | Enterprise Technology Used |
|---|---|
| **Frontend UI/UX** | React 19, Next.js App Router, Tailwind CSS, Shadcn UI / Recharts |
| **API Backend** | Python 3.11+, FastAPI, Uvicorn, ASGI |
| **Machine Learning** | Pandas, Numpy, Scikit-learn, Fairlearn |
| **GenAI / LLMs** | Google Gemini 1.5 Flash (via `google-genai` SDK) |
| **Cloud Hosting** | Vercel (Frontend), Render (Containerized Backend) |
| **Deployment** | Docker, Git Actions CI/CD |
