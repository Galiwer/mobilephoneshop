import { getToken } from './UserService';
import config from '../config';

const BASE_URL = config.apiUrl + "/api/firmware";

// Public endpoints
export const getAllBrands = async () => {
    try {
        const res = await fetch(`${BASE_URL}/brands`);
        if (!res.ok) {
            throw new Error('Failed to fetch brands');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching brands:', error);
        throw error;
    }
};

export const getModelsByBrand = async (brand) => {
    try {
        const res = await fetch(`${BASE_URL}/models/${brand}`);
        if (!res.ok) {
            throw new Error('Failed to fetch models');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching models:', error);
        throw error;
    }
};

export const getFirmwareVersions = async (brand, model) => {
    try {
        const res = await fetch(`${BASE_URL}/view/${brand}/${model}`);
        if (!res.ok) {
            throw new Error('Failed to fetch firmware versions');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching firmware versions:', error);
        throw error;
    }
};

// Admin endpoints (require authentication)
export const uploadFirmware = async (formData) => {
    try {
        const res = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData 
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to upload firmware');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error uploading firmware:', error);
        throw error;
    }
};

export const getAllFirmware = async () => {
    try {
        const res = await fetch(`${BASE_URL}/admin/list`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!res.ok) {
            throw new Error('Failed to fetch firmware');
        }
        const data = await res.json();
        return { data }; // Wrap in data property to match component expectations
    } catch (error) {
        console.error('Error fetching firmware:', error);
        throw error;
    }
};

export const deleteFirmware = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/delete/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!res.ok) {
            throw new Error('Failed to delete firmware');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error deleting firmware:', error);
        throw error;
    }
}; 