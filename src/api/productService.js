import config from "../config";

const BASE_URL = `${config.apiUrl}/api/products`;

// Add debugging to see what URL we're using
console.log('API Base URL:', BASE_URL);

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const getAllProducts = async () => {
  try {
    // Try to get auth headers, but don't fail if they're not available
    let headers = {};
    try {
      headers = getAuthHeaders();
    } catch (e) {
      // If no auth headers available, proceed without them
      console.log('No auth headers available, proceeding as unauthenticated request');
    }

    const res = await fetch(`${BASE_URL}`, {
      headers: headers
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || 'Failed to fetch products');
      } catch (e) {
        throw new Error(errorText || 'Failed to fetch products');
      }
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    console.log('Fetching product with ID:', id);
    console.log('Using URL:', `${BASE_URL}/${id}`);

    // Try to get auth headers, but don't fail if they're not available
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    try {
      const authHeaders = getAuthHeaders();
      headers = { ...headers, ...authHeaders };
      console.log('Using authenticated request');
    } catch (e) {
      console.log('Proceeding with unauthenticated request');
    }

    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: headers
    });
    
    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || `Failed to fetch product (${res.status})`);
      } catch (e) {
        throw new Error(errorText || `Failed to fetch product (${res.status})`);
      }
    }

    const data = await res.json();
    console.log('Successfully fetched product data:', data);
    return data;
  } catch (error) {
    console.error('Error in getProductById:', error);
    throw error;
  }
};

export const createProduct = async (product) => {
  try {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('brand', product.brand);
    formData.append('category', product.category);
    formData.append('price', product.price);
    formData.append('description', product.description);
    formData.append('imageFile', product.imageFile);

    const res = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData
    });

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || 'Failed to create product');
      } catch (e) {
        throw new Error(errorText || 'Failed to create product');
      }
    }

    return res.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('brand', product.brand);
    formData.append('category', product.category);
    formData.append('price', product.price);
    formData.append('description', product.description);
    if (product.imageFile) {
      formData.append('imageFile', product.imageFile);
    }

    const res = await fetch(`${BASE_URL}/update/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: formData
    });

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || 'Failed to update product');
      } catch (e) {
        throw new Error(errorText || 'Failed to update product');
      }
    }

    return res.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/delete/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || 'Failed to delete product');
      } catch (e) {
        throw new Error(errorText || 'Failed to delete product');
      }
    }

    return res.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getImageUrl = (imageFileName) => {
  return `${config.imageUrl}/${imageFileName}`;
};

export const validateProduct = (product) => {
  const requiredFields = ['name', 'brand', 'price', 'category', 'description'];
  const missingFields = requiredFields.filter(field => !product[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (isNaN(parseFloat(product.price)) || parseFloat(product.price) <= 0) {
    throw new Error('Price must be a positive number');
  }

  return true;
};