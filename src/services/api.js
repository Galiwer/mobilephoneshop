import UserService from './UserService';
import config from '../config';

const api = {
  // Products
  getProducts: async () => {
    try {
      console.log('Fetching products from:', `${config.apiUrl}/api/products`);
      return await UserService.axiosInstance.get('/api/products');
    } catch (error) {
      console.error('getProducts error:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      return await UserService.axiosInstance.get(`/api/products/${id}`);
    } catch (error) {
      console.error('getProductById error:', error);
      throw error;
    }
  },

  createProduct: async (formData) => {
    try {
      return await UserService.axiosInstance.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error('createProduct error:', error);
      throw error;
    }
  },

  updateProduct: async (id, formData) => {
    try {
      return await UserService.axiosInstance.put(`/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error('updateProduct error:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      return await UserService.axiosInstance.delete(`/api/products/${id}`);
    } catch (error) {
      console.error('deleteProduct error:', error);
      throw error;
    }
  },

  // Job tracking
  getJobStatus: async (jobNumber) => {
    try {
      return await UserService.axiosInstance.get(`/job/${jobNumber}`);
    } catch (error) {
      console.error('getJobStatus error:', error);
      throw error;
    }
  },

  // Auth endpoints
  login: async (credentials) => {
    try {
      const response = await fetch(`${config.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
        mode: 'cors',
        credentials: 'include',
      });
      const data = await handleResponse(response);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

export default api; 