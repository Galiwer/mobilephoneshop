import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/UserService';
import { getAllProducts, deleteProduct } from '../api/productService';
import config from '../config';
import './ProductList.css';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication and admin status
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        if (!isAdmin()) {
            navigate('/');
            return;
        }
        fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                setProducts(products.filter(product => product.id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    // Function to format price
    const formatPrice = (price) => {
        const formattedNumber = new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0
        }).format(price);
        return `LKR ${formattedNumber}`;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <button onClick={fetchProducts} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <h2>Product Management</h2>
                <button 
                    className="add-product-button"
                    onClick={() => navigate('/create-product')}
                >
                    Add New Product
                </button>
            </div>

            <div className="table-responsive">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="no-products">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <img
                                            src={`${config.imageUrl}/${product.imageFileName}`}
                                            alt={product.name}
                                            className="product-thumbnail"
                                            onError={(e) => {
                                                if (!e.target.src.includes('/placeholder-image.jpg')) {
                                                    e.target.src = '/placeholder-image.jpg';
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.category}</td>
                                    <td>{formatPrice(product.price)}</td>
                                    <td className="action-buttons">
                                        <button
                                            className="edit-button"
                                            onClick={() => navigate(`/edit-product/${product.id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductList;