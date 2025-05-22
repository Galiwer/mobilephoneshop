import config from '../config';

const BASE_URL = config.apiUrl + "/api/products";

// Public Product Management
export const getAllProducts = async () => {
    try {
        const res = await fetch(BASE_URL);
        return res.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/${id}`);
        return res.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

// Protected Product Management (requires authentication)
export const createProduct = async (productData) => {
    try {
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });

        const res = await fetch(BASE_URL, {
            method: 'POST',
            body: formData
        });
        return res.json();
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
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
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        await fetch(`${BASE_URL}/${id}`, { 
            method: 'DELETE' 
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
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