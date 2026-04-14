import axios from 'axios';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = rawApiUrl.replace(/\/+$/, ''); // Remove trailing slashes

const api = axios.create({
  baseURL: API_URL,
});

// Add an interceptor to improve network error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error") {
      error.message = `Network Error: Could not connect to API at ${API_URL}. If on Vercel, ensure NEXT_PUBLIC_API_URL is set in dashboard.`;
    }
    return Promise.reject(error);
  }
);

export const uploadDataset = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload_dataset', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const analyzeBias = async (targetCol: string, sensitiveCol: string, file?: File, fileId?: string) => {
  const formData = new FormData();
  if (file) formData.append('file', file);
  if (fileId) formData.append('file_id', fileId);
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
