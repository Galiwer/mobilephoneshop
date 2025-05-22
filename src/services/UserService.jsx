import config from "../config";

const BASE_URL = config.apiUrl;
const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Token management
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setRefreshToken = (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token);
export const setRole = (role) => localStorage.setItem(ROLE_KEY, role.toUpperCase());

// Auth methods
export const login = async (email, password) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.token) {
            setToken(data.token);
            setRole(data.role);
            if (data.refreshToken) {
                setRefreshToken(data.refreshToken);
            }
        }
        
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const refreshAccessToken = async (refreshToken) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });
        const data = await res.json();
        return data.token;
    } catch (error) {
        console.error('Token refresh error:', error);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(userData)
        });
        return res.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const getYourProfile = async () => {
    try {
        const res = await fetch(`${BASE_URL}/adminuser/get-profile`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return res.json();
    } catch (error) {
        console.error('Profile fetch error:', error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const res = await fetch(`${BASE_URL}/admin/get-all-users`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return res.json();
    } catch (error) {
        console.error('Users fetch error:', error);
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        const res = await fetch(`${BASE_URL}/admin/get-users/${userId}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return res.json();
    } catch (error) {
        console.error('User fetch error:', error);
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const res = await fetch(`${BASE_URL}/admin/update/${userId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(userData)
        });
        return res.json();
    } catch (error) {
        console.error('User update error:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const res = await fetch(`${BASE_URL}/admin/delete/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return res.json();
    } catch (error) {
        console.error('User deletion error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Auth check methods
export const isAuthenticated = () => !!getToken();

export const isAdmin = () => {
    const role = localStorage.getItem(ROLE_KEY);
    return role === 'ADMIN';
};

export const isUser = () => {
    const role = localStorage.getItem(ROLE_KEY);
    return role === 'USER';
};

export const adminOnly = () => isAuthenticated() && isAdmin(); 