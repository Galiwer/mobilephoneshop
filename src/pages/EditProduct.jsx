import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAuthenticated, isAdmin, logout } from '../services/UserService';
import { getProductById, validateProduct, updateProduct, getImageUrl } from '../services/ProductService';
import './EditProduct.css';

const EditProduct = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { 
        state: { returnUrl: `/EditProduct/${id}` } 
      });
      return;
    }

    if (!isAdmin()) {
      navigate("/");
      return;
    }

    fetchProduct();
  }, [id, navigate]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.message || 'Failed to load product. Please try again.');
      
      if (error.status === 401) {
        logout();
        navigate("/login", { 
          state: { returnUrl: `/EditProduct/${id}` } 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    setError(null); // Clear error when user makes changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      // Validate product data
      validateProduct(product);
      
      // Update product
      await updateProduct(id, product);
      
      navigate('/ProductList');
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.message || 'Failed to update product. Please try again.');
      
      if (error.status === 401) {
        logout();
        navigate("/login", { 
          state: { returnUrl: `/EditProduct/${id}` } 
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchProduct} className="retry-button">
          Retry
        </button>
        <button onClick={() => navigate('/ProductList')} className="back-button">
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <p>Product not found.</p>
        <button onClick={() => navigate('/ProductList')} className="back-button">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="edit-product-container">
      <h2 className="title">Edit Product</h2>

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
              disabled={saving}
              placeholder={`Enter product ${field}`}
            />
          </div>
        ))}
        <div className="form-group">
          <label className="form-label">
            Image
            {!product.imageFileName && <span className="required">*</span>}
          </label>
          <input
            className="form-input"
            type="file"
            name="imageFile"
            onChange={handleChange}
            accept="image/*"
            required={!product.imageFileName}
            disabled={saving}
          />
          {product.imageFileName && (
            <div className="current-image">
              <p>Current image:</p>
              <img
                src={getImageUrl(product.imageFileName)}
                alt="Current product"
                className="preview-image"
              />
            </div>
          )}
        </div>
        <div className="form-buttons">
          <button 
            type="submit" 
            className="btn-submit"
            disabled={saving}
          >
            {saving ? (
              <span>
                <i className="fas fa-spinner fa-spin"></i> Updating...
              </span>
            ) : (
              "Update Product"
            )}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate('/ProductList')}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct; 