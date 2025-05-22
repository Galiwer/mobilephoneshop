import { setToken, setRefreshToken, setRole, logout } from './UserService';
import config from '../config';

const BASE_URL = config.apiUrl;

// Auth endpoints
export const login = async (credentials) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const data = await res.json();
        if (data.token) {
            setToken(data.token);
            if (data.refreshToken) {
                setRefreshToken(data.refreshToken);
            }
            if (data.role) {
                setRole(data.role);
            }
        }
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logoutUser = () => {
    logout();
};

// Job tracking
export const getJobStatus = async (jobNumber) => {
    try {
        const res = await fetch(`${BASE_URL}/job/${jobNumber}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return res.json();
    } catch (error) {
        console.error('getJobStatus error:', error);
        throw error;
    }
}; 