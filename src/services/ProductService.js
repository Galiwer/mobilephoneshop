import UserService from './UserService';
import config from '../config';
import axios from 'axios';

class ProductService {
    static axiosInstance = UserService.axiosInstance;
    
    // Create a public instance without auth headers for public endpoints
    static publicAxiosInstance = axios.create({
        baseURL: config.apiUrl,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    // Public Product Management
    static async getAllProducts() {
        try {
            const response = await this.publicAxiosInstance.get('/api/products');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw UserService.handleError(error);
        }
    }

    static async getProductById(id) {
        try {
            const response = await this.publicAxiosInstance.get(`/api/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw UserService.handleError(error);
        }
    }

    // Protected Product Management (requires authentication)
    static async createProduct(productData) {
        try {
            const formData = new FormData();
            Object.keys(productData).forEach(key => {
                formData.append(key, productData[key]);
            });

            const response = await this.axiosInstance.post('/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            console.error('Error creating product:', error);
            throw UserService.handleError(error);
        }
    }

    static async updateProduct(id, productData) {
        try {
            const formData = new FormData();
            Object.keys(productData).forEach(key => {
                if (key !== 'imageFileName' || (key === 'imageFile' && productData[key])) {
                    formData.append(key, productData[key]);
                }
            });

            const response = await this.axiosInstance.put(`/api/products/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            console.error('Error updating product:', error);
            throw UserService.handleError(error);
        }
    }

    static async deleteProduct(id) {
        try {
            const response = await this.axiosInstance.delete(`/api/products/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw UserService.handleError(error);
        }
    }

    // Helper methods
    static getImageUrl(imageFileName) {
        return `${config.imageUrl}/${imageFileName}`;
    }

    static validateProduct(product) {
        const requiredFields = ['name', 'brand', 'price', 'category', 'description'];
        const missingFields = requiredFields.filter(field => !product[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        if (isNaN(parseFloat(product.price)) || parseFloat(product.price) <= 0) {
            throw new Error('Price must be a positive number');
        }

        return true;
    }
}

export default ProductService; 