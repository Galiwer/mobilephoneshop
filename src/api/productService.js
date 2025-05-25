import config from "../config";

const BASE_URL = config.apiUrl + "/api/products";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }
  return {
    'Authorization': `Bearer ${token}`
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
    // Try to get auth headers, but don't fail if they're not available
    let headers = {};
    try {
      headers = getAuthHeaders();
    } catch (e) {
      // If no auth headers available, proceed without them
      console.log('No auth headers available, proceeding as unauthenticated request');
    }

    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: headers
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || 'Failed to fetch product');
      } catch (e) {
        throw new Error(errorText || 'Failed to fetch product');
      }
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
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