import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/firmware';
// Remove the duplicate 'api/' in the URL path

const api = {
  uploadFirmware: (firmwareData) => {
    return axios.post(API_BASE_URL, firmwareData);
  },
  
  getAllFirmware: () => {
    return axios.get(API_BASE_URL);
  },
  
  deleteFirmware: (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`);
  },
  
  getAllBrands: () => {
    return axios.get(`${API_BASE_URL}/brands`);
  },
  
  getModelsByBrand: (brand) => {
    return axios.get(`${API_BASE_URL}/models/${brand}`);
  },
  
  getFirmwareVersions: (brand, model) => {
    return axios.get(`${API_BASE_URL}/${brand}/${model}`);
  },
  
  getDeviceData: () => {
    return axios.get(`${API_BASE_URL}/device-data`);
  }
};

export default api;