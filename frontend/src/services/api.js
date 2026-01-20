import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const login = async (username, password) => {
  const response = await api.post('/auth/login/', { username, password });
  if (response.data.access) {
    localStorage.setItem('access_token', response.data. access);
    localStorage.setItem('refresh_token', response.data.refresh);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/user/');
  return response. data;
};

// Applications - Optimized with query params
export const getApplications = async (params = {}) => {
  const response = await api.get('/applications/', { params });
  return response.data;
};

export const getApplication = async (id) => {
  const response = await api.get(`/applications/${id}/`);
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await api.post(`/applications/${id}/update_status/`, { status });
  return response.data;
};

export const updateApplicationFeedback = async (id, feedback, remarks) => {
  const response = await api.post(`/applications/${id}/update_feedback/`, { feedback, remarks });
  return response.data;
};

// Metadata
export const getPoliceStations = async () => {
  const response = await api.get('/police-stations/');
  return response. data;
};

export const getCategories = async () => {
  const response = await api.get('/categories/');
  return response. data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard-stats/');
  return response.data;
};

export const uploadExcel = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload-excel/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    },
  });
  
  return response.data;
};

export default api;