import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
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

// ==========================================
// AUTH APIs
// ==========================================

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

// ==========================================
// APPLICATIONS APIs - Full CRUD
// ==========================================

// GET - Fetch all applications with optional filters
export const getApplications = async (params = {}) => {
  try {
    console.time('⚡ Fetch Applications');
    
    const response = await api.get('/applications/', { params });
    
    console.timeEnd('⚡ Fetch Applications');
    
    // Handle both paginated and non-paginated responses
    const data = response.data.results || response.data;
    
    console.log(`✅ Fetched ${data.length} applications`);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    throw error;
  }
};

// GET - Fetch single application by ID
export const getApplicationById = async (id) => {
  try {
    const response = await api.get(`/applications/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching application ${id}:`, error);
    throw error;
  }
};

// POST - Create new application
export const createApplication = async (data) => {
  try {
    console.log('📝 Creating new application:', data);
    const response = await api.post('/applications/', data);
    console.log('✅ Application created successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Error creating application:', error);
    throw error;
  }
};

// PUT - Update entire application
export const updateApplication = async (id, data) => {
  try {
    console.log(`📝 Updating application ${id}:`, data);
    const response = await api.put(`/applications/${id}/`, data);
    console.log('✅ Application updated successfully');
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating application ${id}:`, error);
    throw error;
  }
};

// PATCH - Partial update of application
export const patchApplication = async (id, data) => {
  try {
    console.log(`📝 Patching application ${id}:`, data);
    const response = await api.patch(`/applications/${id}/`, data);
    console.log('✅ Application patched successfully');
    return response.data;
  } catch (error) {
    console.error(`❌ Error patching application ${id}:`, error);
    throw error;
  }
};

// DELETE - Delete application
export const deleteApplication = async (id) => {
  try {
    console.log(`🗑️ Deleting application ${id}`);
    const response = await api.delete(`/applications/${id}/`);
    console.log('✅ Application deleted successfully');
    return response.data;
  } catch (error) {
    console.error(`❌ Error deleting application ${id}:`, error);
    throw error;
  }
};

// PATCH - Update only status
export const updateApplicationStatus = async (id, status) => {
  try {
    const response = await api.patch(`/applications/${id}/`, { status });
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating status for application ${id}:`, error);
    throw error;
  }
};

// PATCH - Update only feedback
export const updateApplicationFeedback = async (id, feedback, remarks = '') => {
  try {
    const response = await api.patch(`/applications/${id}/`, { feedback, remarks });
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating feedback for application ${id}:`, error);
    throw error;
  }
};

// ==========================================
// DASHBOARD APIs
// ==========================================

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard-stats/');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    throw error;
  }
};

// ==========================================
// METADATA APIs
// ==========================================

export const getPoliceStations = async () => {
  try {
    const response = await api.get('/police-stations/');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching police stations:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories/');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    throw error;
  }
};

// ==========================================
// EXCEL UPLOAD API
// ==========================================

export const uploadExcel = async (file) => {
  try {
    console.log('📤 Uploading Excel file:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload-excel/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ Excel file uploaded successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Error uploading Excel file:', error);
    throw error;
  }
};

export default api;