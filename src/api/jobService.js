import axios from 'axios';
import { showError } from '../components/ErrorHandler';
import config from '../config';

const API_URL = `${config.apiUrl}/api/jobs`;

export const createJob = async (jobData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, jobData);
    return response.data;
  } catch (error) {
    showError(error);
    throw error;
  }
};

export const getJob = async (jobNumber) => {
  try {
    const response = await axios.get(`${API_URL}/${jobNumber}`);
    return response.data;
  } catch (error) {
    showError(error);
    throw error;
  }
};

export const getPublicJob = async (jobNumber) => {
  try {
    const response = await axios.get(`${API_URL}/public/${jobNumber}`);
    return response.data;
  } catch (error) {
    showError(error);
    throw error;
  }
};

export const updateJobStatus = async (jobNumber, status) => {
  try {
    const response = await axios.put(`${API_URL}/update/${jobNumber}`, { status });
    return response.data;
  } catch (error) {
    showError(error);
    throw error;
  }
};

export const deleteJob = async (jobNumber) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${jobNumber}`);
    return response.data;
  } catch (error) {
    showError(error);
    throw error;
  }
};

export const getAllJobs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    showError(error);
    throw error;
  }
}; 