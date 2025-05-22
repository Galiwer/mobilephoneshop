import { axiosInstance, handleError } from '../services/UserService';
import config from '../config';

// Status codes and text mapping
export const statusMap = {
    1: 'In Queue',
    2: 'Processing',
    3: 'Completed'
};

// Job Management
export const getAllJobs = async () => {
    try {
        const response = await axiosInstance.get('/jobs');
        return response;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw handleError(error);
    }
};

export const getJobById = async (jobNumber) => {
    try {
        const response = await axiosInstance.get(`/job/${jobNumber}`);
        return response;
    } catch (error) {
        console.error('Error fetching job:', error);
        throw handleError(error);
    }
};

export const createJob = async (jobData) => {
    try {
        const response = await axiosInstance.post('/job', jobData);
        return response;
    } catch (error) {
        console.error('Error creating job:', error);
        throw handleError(error);
    }
};

export const updateJobStatus = async (jobNumber, status) => {
    try {
        const response = await axiosInstance.put(`/job/${jobNumber}/status`, status);
        return response;
    } catch (error) {
        console.error('Error updating job status:', error);
        throw handleError(error);
    }
};

export const deleteJob = async (jobNumber) => {
    try {
        const response = await axiosInstance.delete(`/job/${jobNumber}`);
        return response;
    } catch (error) {
        console.error('Error deleting job:', error);
        throw handleError(error);
    }
};

export const getStatusCode = (statusText) => {
    return Object.entries(statusMap).find(([code, text]) => text === statusText)?.[0] || 1;
};

export const getStatusText = (statusCode) => {
    return statusMap[statusCode] || 'Unknown';
}; 