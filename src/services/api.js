import config from '../config';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      errorText,
      url: response.url,
    });
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const api = {
  // Products
  getProducts: async () => {
    try {
      console.log('Fetching products from:', `${config.apiUrl}/api/products`);
      const response = await fetch(`${config.apiUrl}/api/products`, {
        method: 'GET',
        mode: 'cors',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('getProducts error:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await fetch(`${config.apiUrl}/api/products/${id}`, {
        method: 'GET',
        mode: 'cors',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('getProductById error:', error);
      throw error;
    }
  },

  createProduct: async (formData) => {
    try {
      const response = await fetch(`${config.apiUrl}/api/products`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('createProduct error:', error);
      throw error;
    }
  },

  updateProduct: async (id, formData) => {
    try {
      const response = await fetch(`${config.apiUrl}/api/products/${id}`, {
        method: 'PUT',
        body: formData,
        mode: 'cors',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('updateProduct error:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await fetch(`${config.apiUrl}/api/products/${id}`, {
        method: 'DELETE',
        mode: 'cors',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('deleteProduct error:', error);
      throw error;
    }
  },

  // Job tracking
  getJobStatus: async (jobNumber) => {
    try {
      const response = await fetch(`${config.apiUrl}/job/${jobNumber}`, {
        method: 'GET',
        mode: 'cors',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('getJobStatus error:', error);
      throw error;
    }
  }
};

export default api; 