import { getToken } from '../services/UserService';
import config from '../config';

const BASE_URL = config.apiUrl + "/api/jobs";

// Status codes and text mapping
export const statusMap = {
    'IN_QUEUE': 'In Queue',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed'
};

// Public tracking endpoints
export const getJobStatus = async (jobNumber) => {
    try {
        const res = await fetch(`${BASE_URL}/track/${jobNumber}`);
        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || 'Failed to fetch job status');
        }
        return res.json();
    } catch (error) {
        console.error('Error fetching job status:', error);
        throw error;
    }
};

// Admin endpoints
export const getAllJobs = async () => {
    try {
        const res = await fetch(`${BASE_URL}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || 'Failed to fetch jobs');
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
            const error = await res.text();
            throw new Error(error || 'Failed to fetch job');
        }
        return res.json();
    } catch (error) {
        console.error('Error fetching job:', error);
        throw error;
    }
};

export const createJob = async (jobData) => {
    try {
        const res = await fetch(`${BASE_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(jobData)
        });
        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || 'Failed to create job');
        }
        return res.json();
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
};

export const updateJobStatus = async (jobNumber, status) => {
    try {
        const res = await fetch(`${BASE_URL}/update/${jobNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ status })
        });
        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || 'Failed to update job status');
        }
        return res.json();
    } catch (error) {
        console.error('Error updating job status:', error);
        throw error;
    }
};

export const deleteJob = async (jobNumber) => {
    try {
        const res = await fetch(`${BASE_URL}/delete/${jobNumber}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || 'Failed to delete job');
        }
        return res.json();
    } catch (error) {
        console.error('Error deleting job:', error);
        throw error;
    }
};

// Helper functions
export const getStatusCode = (statusText) => {
    return Object.entries(statusMap).find(([code, text]) => text === statusText)?.[0];
};

export const getStatusText = (statusCode) => {
    return statusMap[statusCode] || 'Unknown';
}; 