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
        const response = await fetch(`${BASE_URL}/admin/list`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch firmware list');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching firmware:', error);
        throw error;
    }
};

export const deleteFirmware = async (firmwareId) => {
    try {
        const response = await fetch(`${BASE_URL}/delete/${firmwareId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete firmware');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting firmware:', error);
        throw error;
    }
};

export const downloadFirmware = async (firmwareId) => {
    try {
        const response = await fetch(`${BASE_URL}/download/${firmwareId}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to download firmware');
        }

        // Check if it's a Google Drive link
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.firmwareLink) {
                // Redirect to Google Drive link
                window.open(data.firmwareLink, '_blank');
                return;
            }
        }

        // Handle file download
        const blob = await response.blob();
        const contentDisposition = response.headers.get('content-disposition');
        const filename = contentDisposition
            ? contentDisposition.split('filename=')[1].replace(/"/g, '')
            : 'firmware.bin';

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading firmware:', error);
        throw error;
    }
}; 