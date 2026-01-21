import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios. create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request. use(
  (config) => {
    const token = localStorage. getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('accessToken', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const login = async (username, password) => {
  const response = await api.post('/auth/login/', { username, password });
  return response.data;
};

export const logout = async (refreshToken) => {
  const response = await api.post('/auth/logout/', { refresh: refreshToken });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/user/');
  return response.data;
};

// ⚡ APPLICATIONS API - SUPER FAST (Single Request, No Pagination)
export const getApplications = async (params = {}) => {
  try {
    console.time('⚡ Fetch Applications');
    
    const response = await api.get('/applications/', { params });
    
    console.timeEnd('⚡ Fetch Applications');
    
    // Handle both paginated and non-paginated responses
    const data = response.data. results || response.data;
    
    console.log(`✅ Fetched ${data.length} applications`);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    throw error;
  }
};

export const getApplicationById = async (id) => {
  const response = await api.get(`/applications/${id}/`);
  return response.data;
};

export const createApplication = async (data) => {
  const response = await api.post('/applications/', data);
  return response.data;
};

export const updateApplication = async (id, data) => {
  const response = await api. put(`/applications/${id}/`, data);
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}/`);
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await api.patch(`/applications/${id}/`, { status });
  return response. data;
};

export const updateApplicationFeedback = async (id, feedback, remarks = '') => {
  const response = await api.patch(`/applications/${id}/`, { feedback, remarks });
  return response.data;
};

// Dashboard APIs
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard-stats/');
  return response. data;
};

// Metadata APIs
export const getPoliceStations = async () => {
  const response = await api. get('/police-stations/');
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories/');
  return response.data;
};

// Upload Excel
export const uploadExcel = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload-excel/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export default api;