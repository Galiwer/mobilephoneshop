import axios from 'axios';
import { API_BASE_URL } from '../config';

const FIRMWARE_API = `${API_BASE_URL}/api/firmware`;

// Public endpoints
export const getAllBrands = async () => {
    const response = await axios.get(`${FIRMWARE_API}/brands`);
    return response.data;
};

export const getModelsByBrand = async (brand) => {
    const response = await axios.get(`${FIRMWARE_API}/models/${brand}`);
    return response.data;
};

export const getFirmwareVersions = async (brand, model) => {
    try {
        const response = await axios.get(`${FIRMWARE_API}/admin/list`);
        return response.data.filter(firmware => 
            firmware.brand === brand && 
            firmware.model === model &&
            firmware.active
        );
    } catch (error) {
        console.error('Error fetching firmware versions:', error);
        throw error;
    }
};

// Admin endpoints (require authentication)
export const uploadFirmware = (formData) => {
    return axios.post(`${FIRMWARE_API}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getAllFirmware = () => {
    return axios.get(`${FIRMWARE_API}/admin/list`);
};

export const deleteFirmware = (id) => {
    return axios.delete(`${FIRMWARE_API}/delete/${id}`);
};

export const downloadFirmware = async (id) => {
    try {
        const response = await axios.get(`${FIRMWARE_API}/download/${id}`);
        const data = response.data;

        if (data.type === 'link') {
            // For Google Drive links, return the URL for external opening
            return {
                type: 'link',
                url: data.url,
                fileName: data.fileName
            };
        } else if (data.type === 'file') {
            // For files, initiate download
            const fileResponse = await axios.get(data.url, {
                responseType: 'blob'
            });
            const downloadUrl = window.URL.createObjectURL(new Blob([fileResponse.data]));
            return {
                type: 'file',
                url: downloadUrl,
                fileName: data.fileName
            };
        } else {
            throw new Error('Invalid firmware type received');
        }
    } catch (error) {
        console.error('Error downloading firmware:', error);
        throw error;
    }
}; 