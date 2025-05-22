import axios from "axios";
import config from "../config";

class UserService {
    static BASE_URL = config.apiUrl;
    static TOKEN_KEY = 'token';
    static ROLE_KEY = 'role';
    static REFRESH_TOKEN_KEY = 'refreshToken';

    // Create axios instance with default config
    static axiosInstance = axios.create({
        baseURL: UserService.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    // Initialize axios interceptors
    static {
        this.initializeInterceptors();
    }

    static initializeInterceptors() {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response) => response.data,
            async (error) => {
                const originalRequest = error.config;

                // Handle token expiration
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    
                    try {
                        const refreshToken = this.getRefreshToken();
                        if (refreshToken) {
                            const newToken = await this.refreshAccessToken(refreshToken);
                            this.setToken(newToken);
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return this.axiosInstance(originalRequest);
                        }
                    } catch (refreshError) {
                        this.logout();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }

                // Handle other errors
                if (error.response) {
                    switch (error.response.status) {
                        case 403:
                            console.error('Access forbidden');
                            break;
                        case 404:
                            console.error('Resource not found');
                            break;
                        default:
                            console.error('API Error:', error.response.data);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    // Token management
    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static setToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    static setRefreshToken(token) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }

    static setRole(role) {
        localStorage.setItem(this.ROLE_KEY, role.toUpperCase());
    }

    // Auth methods
    static async login(email, password) {
        try {
            const response = await this.axiosInstance.post('/auth/login', { email, password });
            const { token, refreshToken, role } = response;
            
            if (token) {
                this.setToken(token);
                this.setRole(role);
                if (refreshToken) {
                    this.setRefreshToken(refreshToken);
                }
            }
            
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw this.handleError(error);
        }
    }

    static async refreshAccessToken(refreshToken) {
        try {
            const response = await this.axiosInstance.post('/auth/refresh', { refreshToken });
            return response.token;
        } catch (error) {
            console.error('Token refresh error:', error);
            throw this.handleError(error);
        }
    }

    static async register(userData, token) {
        try {
            return await this.axiosInstance.post('/auth/register', userData);
        } catch (error) {
            console.error('Registration error:', error);
            throw this.handleError(error);
        }
    }

    static async getYourProfile() {
        try {
            return await this.axiosInstance.get('/adminuser/get-profile');
        } catch (error) {
            console.error('Profile fetch error:', error);
            throw this.handleError(error);
        }
    }

    static async getAllUsers() {
        try {
            return await this.axiosInstance.get('/admin/get-all-users');
        } catch (error) {
            console.error('Users fetch error:', error);
            throw this.handleError(error);
        }
    }

    static async getUserById(userId) {
        try {
            return await this.axiosInstance.get(`/admin/get-users/${userId}`);
        } catch (error) {
            console.error('User fetch error:', error);
            throw this.handleError(error);
        }
    }

    static async updateUser(userId, userData) {
        try {
            return await this.axiosInstance.put(`/admin/update/${userId}`, userData);
        } catch (error) {
            console.error('User update error:', error);
            throw this.handleError(error);
        }
    }

    static async deleteUser(userId) {
        try {
            return await this.axiosInstance.delete(`/admin/delete/${userId}`);
        } catch (error) {
            console.error('User deletion error:', error);
            throw this.handleError(error);
        }
    }

    static logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.ROLE_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        // Optionally make a logout API call here
    }

    // Auth check methods
    static isAuthenticated() {
        return !!this.getToken();
    }

    static isAdmin() {
        const role = localStorage.getItem(this.ROLE_KEY);
        return role === 'ADMIN';
    }

    static isUser() {
        const role = localStorage.getItem(this.ROLE_KEY);
        return role === 'USER';
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }

    // Error handling
    static handleError(error) {
        if (error.response) {
            const { status, data } = error.response;
            return {
                status,
                message: data.message || 'An error occurred',
                error: data
            };
        }
        return {
            status: 500,
            message: 'Network error or server is unreachable',
            error: error.message
        };
    }
}

export default UserService; 