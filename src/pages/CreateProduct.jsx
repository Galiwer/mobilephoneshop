import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, logout } from '../services/UserService';
import { validateProduct, createProduct } from '../services/ProductService';
import './CreateProduct.css';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    description: '',
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for admin access
    if (!isAuthenticated()) {
      navigate("/login", { 
        state: { returnUrl: "/CreateProduct" } 
      });
      return;
    }

    if (!isAdmin()) {
      navigate("/");
      return;
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduct((prev) => ({ 
      ...prev, 
      [name]: files ? files[0] : value 
    }));
    setError(null); // Clear error when user makes changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validate product data
      validateProduct(product);
      
      // Create product
      await createProduct(product);
      
      navigate('/ProductList');
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.message || 'Failed to create product. Please try again.');
      
      // Handle authentication errors
      if (error.status === 401) {
        logout();
        navigate("/login", { 
          state: { returnUrl: "/CreateProduct" } 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product-container">
      <h2 className="title">New Product</h2>
      
      {error && (
        <div className="error-message" style={{ 
          margin: '10px 0', 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          borderRadius: '4px',
          textAlign: 'center' 
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="product-form">
        {['name', 'brand', 'price', 'category', 'description'].map((field) => (
          <div className="form-group" key={field}>
            <label className="form-label">
              {field.charAt(0).toUpperCase() + field.slice(1)}
              <span className="required">*</span>
            </label>
            <input
              className="form-input"
              type={field === 'price' ? 'number' : 'text'}
              step={field === 'price' ? "0.01" : undefined}
              name={field}
              value={product[field] || ''}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder={`Enter product ${field}`}
            />
          </div>
        ))}
        <div className="form-group">
          <label className="form-label">
            Image
            <span className="required">*</span>
          </label>
          <input 
            className="form-input" 
            type="file" 
            name="imageFile" 
            onChange={handleChange}
            accept="image/*"
            required 
            disabled={loading}
          />
        </div>
        <div className="form-buttons">
          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading}
          >
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin"></i> Creating...
              </span>
            ) : (
              "Create Product"
            )}
          </button>
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={() => navigate('/ProductList')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct; 