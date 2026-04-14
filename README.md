# FairAI – Bias Detection and Fairness Analysis Platform

FairAI is a powerful dataset and machine learning model bias detection platform. It evaluates demographic parity, disparate impact, and equal opportunity while using **Google Gemini AI** to automatically generate bias explanations and mitigation suggestions.

## Hackathon Prototype Features
- 📊 **Dataset Upload & Preview**: Upload CSVs and select sensitive vs target features.
- ⚖️ **Fairness Metrics Detection**: Calculates Demographic Parity, Equal Opportunity, and Disparate Impact Ratio.
- 📈 **Bias Visualizations**: Beautiful interactive Bar and Pie charts powered by Plotly.
- 🤖 **AI-Generated Insights**: Integration with Google Gemini for bias explanations and mitigation recommendations.
- 👨‍💻 **Team Member Section**: Dedicated showcase in the UI.

## Technology Stack
- **Frontend / Dashboard**: Streamlit
- **Backend / API**: FastAPI (Available via `backend/main.py`)
- **Core ML Calculation**: Scikit-learn, Fairlearn, Pandas, NumPy
- **Generative AI Integration**: Google Gemini API (`gemini-1.5-flash`)
- **Data Visualization**: Plotly, Streamlit

## Team Members
- Amrit Anand (rounakjha122@gmail.com)
- Kapil Vishwakarma (kapilbhai758@gmail.com)
- Subham Sharma (subhamsharma765688@gmail.com)
- Anish Raj (Leader) (anishkumar9905287@gmail.com)

## Folder Structure
```text
fairai/
 ├ frontend/                # Potential future React implementation
 ├ backend/
 │ └ main.py                # FastAPI backend endpoints
 ├ bias_detection/
 │ ├ __init__.py
 │ ├ metrics.py             # Fairness metrics logic
 │ └ ai_explainer.py        # Google Gemini Integration
 ├ dashboard/               # Alternative location for frontend
 ├ requirements.txt         # Dependencies
 ├ app.py                   # Main Streamlit Dashboard (Entrypoint)
 └ README.md                # Project documentation
```

## How to Run Locally

### 1. Requirements
Ensure you have Python 3.9+ installed.

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Setup Gemini API Card
You will need a Google Gemini API Key. You can get one from Google AI Studio. 
You can either input the API key in the UI or set it as an environment variable:
```bash
# Windows
set GEMINI_API_KEY="your-api-key"
# Mac/Linux
export GEMINI_API_KEY="your-api-key"
```

### 4. Run the Platform
The easiest way is to launch the Streamlit frontend. It processes the Python backend directly for this quick prototype:
```bash
streamlit run app.py
```

*To run the standalone FastAPI backend for API integrations:*
```bash
uvicorn backend.main:app --reload
```

## Cloud Deployment Instructions

### Streamlit Cloud (Recommended for Hackathons)
1. Push this repository to a public GitHub repo.
2. Go to [share.streamlit.io](https://share.streamlit.io/)
3. Connect your GitHub and select the repository.
4. Set main file path as `app.py`.
5. Enter your `GEMINI_API_KEY` into the Streamlit Cloud "Secrets" in advanced settings.
6. Click Deploy.

### Google Cloud Run Implementation
1. Create a `Dockerfile`:
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8501
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```
2. Build and Push the image to GCP Artifact Registry.
3. Deploy to **Cloud Run**, expose port 8501, and pass `GEMINI_API_KEY` via Environment Variables.

---
Built with ❤️ for the Hackathon by our Team.
