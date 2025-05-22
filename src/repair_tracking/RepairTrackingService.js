import { getToken } from '../services/UserService';
import config from '../config';

const BASE_URL = config.apiUrl + "/api/jobs";

// Status codes and text mapping
export const statusMap = {
    1: 'In Queue',
    2: 'Processing',
    3: 'Completed'
};

// Job Management
export const getAllJobs = async () => {
    try {
        const res = await fetch(`${BASE_URL}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!res.ok) {
            throw new Error('Failed to fetch jobs');
        }
        return res.json();
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

export const getJobById = async (jobNumber) => {
    try {
        const res = await fetch(`${BASE_URL}/${jobNumber}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!res.ok) {
            throw new Error('Failed to fetch job');
        }
        return res.json();
    } catch (error) {
        console.error('Error fetching job:', error);
        throw error;
    }
};

export const createJob = async (jobData) => {
    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(jobData)
        });
        if (!res.ok) {
            throw new Error('Failed to create job');
        }
        return res.json();
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
};

export const updateJobStatus = async (jobNumber, status) => {
    try {
        const res = await fetch(`${BASE_URL}/${jobNumber}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ status })
        });
        if (!res.ok) {
            throw new Error('Failed to update job status');
        }
        return res.json();
    } catch (error) {
        console.error('Error updating job status:', error);
        throw error;
    }
};

export const deleteJob = async (jobNumber) => {
    try {
        const res = await fetch(`${BASE_URL}/${jobNumber}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!res.ok) {
            throw new Error('Failed to delete job');
        }
        return res.json();
    } catch (error) {
        console.error('Error deleting job:', error);
        throw error;
    }
};

export const getStatusCode = (statusText) => {
    return Object.entries(statusMap).find(([code, text]) => text === statusText)?.[0] || 1;
};

export const getStatusText = (statusCode) => {
    return statusMap[statusCode] || 'Unknown';
}; 