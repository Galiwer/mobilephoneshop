import axios from 'axios';
import config from '../config';

const API_BASE_URL = config.apiUrl;

// Auth token management
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// Axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          removeToken();
          // Optionally redirect to login
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access forbidden');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

const api = {
  // Auth endpoints
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
        headers: { 'Content-Type': 'application/json' }
      });
      const { token } = response.data;
      if (token) {
        setToken(token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    removeToken();
    // Optionally make a logout API call here if your backend requires it
  },

  // Firmware endpoints with JWT auth
  uploadFirmware: (firmwareData) => {
    return axiosInstance.post('', firmwareData, {
      headers: {
        'Content-Type': 'multipart/form-data' // For file uploads
      }
    });
  },
  
  getAllFirmware: () => {
    return axiosInstance.get('');
  },
  
  deleteFirmware: (id) => {
    return axiosInstance.delete(`/${id}`);
  },
  
  getAllBrands: () => {
    return axiosInstance.get('/brands');
  },
  
  getModelsByBrand: (brand) => {
    return axiosInstance.get(`/models/${brand}`);
  },
  
  getFirmwareVersions: (brand, model) => {
    return axiosInstance.get(`/${brand}/${model}`);
  },
  
  getDeviceData: () => {
    return axiosInstance.get('/device-data');
  },

  // Helper methods for token management
  isAuthenticated: () => {
    return !!getToken();
  },

  getAuthToken: () => {
    return getToken();
  }
};

export default api;