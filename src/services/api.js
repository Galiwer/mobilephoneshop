import UserService from './UserService';
import config from '../config';

const BASE_URL = config.apiUrl;

const api = {
  // Auth endpoints
  login: async (credentials) => {
    try {
      const response = await UserService.axiosInstance.post('/auth/login', credentials);
      if (response.token) {
        UserService.setToken(response.token);
        if (response.refreshToken) {
          UserService.setRefreshToken(response.refreshToken);
        }
        if (response.role) {
          UserService.setRole(response.role);
        }
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    UserService.logout();
  },

  // Job tracking
  getJobStatus: async (jobNumber) => {
    try {
      const res = await fetch(`${BASE_URL}/job/${jobNumber}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return res.json();
    } catch (error) {
      console.error('getJobStatus error:', error);
      throw error;
    }
  }
};

export default api; 