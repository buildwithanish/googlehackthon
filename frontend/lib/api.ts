import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

export const uploadDataset = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload_dataset', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const analyzeBias = async (file: File, targetCol: string, sensitiveCol: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('target_col', targetCol);
  formData.append('sensitive_col', sensitiveCol);
  
  const response = await api.post('/analyze_bias', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getFairnessMetrics = async () => {
  const response = await api.get('/fairness_metrics');
  return response.data;
};

export const getBiasReport = async (file: File, targetCol: string, sensitiveCol: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('target_col', targetCol);
  formData.append('sensitive_col', sensitiveCol);
  formData.append('gemini_api_key', process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  
  const response = await api.post('/generate_ai_explanation', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export default api;
