# Backend Dockerfile for FairAI (FastAPI + Streamlit)
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Default: run FastAPI backend on port 8000
EXPOSE 8000

# For FastAPI (REST API)
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

# Alternate CMD for Streamlit:
# CMD ["streamlit", "run", "app.py", "--server.port=8080", "--server.address=0.0.0.0"]
