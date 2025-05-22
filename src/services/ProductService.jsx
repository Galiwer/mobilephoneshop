import config from '../config';

const BASE_URL = config.apiUrl + "/api/products";

// Public Product Management
export const getAllProducts = async () => {
    const res = await fetch(BASE_URL);
    return res.json();
};

export const getProductById = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    return res.json();
};

// Protected Product Management (requires authentication)
export const createProduct = async (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
    });

    const res = await fetch(BASE_URL, {
        method: 'POST',
        body: formData
    });
    return res.json();
};

export const updateProduct = async (id, productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
        if (key !== 'imageFileName' || (key === 'imageFile' && productData[key])) {
            formData.append(key, productData[key]);
        }
    });

    const res = await fetch(`${BASE_URL}/update/${id}`, {
        method: 'PUT',
        body: formData
    });
    return res.json();
};

export const deleteProduct = async (id) => {
    await fetch(`${BASE_URL}/${id}`, { 
        method: 'DELETE' 
    });
};

// Helper functions
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