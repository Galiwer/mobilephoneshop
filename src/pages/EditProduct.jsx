import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../services/UserService';
import './EditProduct.css';

const EditProduct = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
   
    if (!UserService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (!UserService.isAdmin()) {
      navigate("/");
      return;
    }

    fetchProduct();
  }, [id, navigate]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      setProduct(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product. Please try again.');
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(product).forEach((key) => {
        if (key !== 'imageFileName' || (key === 'imageFile' && product[key])) {
          formData.append(key, product[key]);
        }
      });

      const response = await fetch(`http://localhost:8080/api/products/update/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      navigate('/ProductList');
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product. Please try again.');
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
        <p>{error}</p>
        <button onClick={fetchProduct} className="retry-button">
          Retry
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
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="product-form">
        {['name', 'brand', 'price', 'category', 'description'].map((field) => (
          <div className="form-group" key={field}>
            <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              className="form-input"
              type={field === 'price' ? 'number' : 'text'}
              step={field === 'price' ? "0.01" : undefined}
              name={field}
              value={product[field] || ''}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <div className="form-group">
          <label className="form-label">Image</label>
          <input
            className="form-input"
            type="file"
            name="imageFile"
            onChange={handleChange}
            accept="image/*"
          />
          {product.imageFileName && (
            <div className="current-image">
              <p>Current image:</p>
              <img
                src={`http://localhost:8080/images/${product.imageFileName}`}
                alt="Current product"
                className="preview-image"
              />
            </div>
          )}
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn-submit">Update</button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate('/ProductList')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct; 