import axios from 'axios';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fairai-backend.onrender.com';
const API_URL = rawApiUrl.replace(/\/+$/, ''); // Remove trailing slashes

const api = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 120 seconds timeout to allow Render to wake up
});

// Step 2: Automatic Retry Logic (5 Retries for Cold Starts)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    // Retry only on network errors or 503/504 Service Unavailable (Render sleeping)
    if (!config || !config.retryCount) config.retryCount = 0;
    
    if (config.retryCount < 5 && (!response || response.status >= 500)) {
        config.retryCount += 1;
        console.log(`[FairAI API] Render is sleeping. Retry attempt #${config.retryCount} for ${config.url}`);
        
        // Progressive backoff delay (2s, 4s, 6s, 8s, 10s)
        const delay = config.retryCount * 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return api(config);
    }

    if (error.message === "Network Error" || (response && response.status >= 500)) {
      error.message = `Neural Core is initializing. Please wait 30-60 seconds for the service to wake up. Base URL: ${API_URL}`;
    }
    return Promise.reject(error);
  }
);

// Step 4: Health Check Ping
export const pingHealth = async () => {
  try {
    const res = await api.get('/health', { timeout: 5000 });
    return res.data?.status === "ok";
  } catch (e) {
    return false;
  }
};

export const uploadDataset = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload_dataset', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const analyzeBias = async (targetCol: string, sensitiveCol: string, file?: File, fileId?: string, geminiApiKey?: string, nlqQuery?: string) => {
  const formData = new FormData();
  if (file) formData.append('file', file);
  if (fileId) formData.append('file_id', fileId);
  formData.append('target_col', targetCol);
  formData.append('sensitive_col', sensitiveCol);
  if (geminiApiKey) formData.append('gemini_api_key', geminiApiKey);
  if (nlqQuery) formData.append('nlq_query', nlqQuery);
  
  const response = await api.post('/analyze_bias', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getDatasetProfile = async (fileId: string) => {
  const response = await api.get(`/get_profile/${fileId}`);
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
