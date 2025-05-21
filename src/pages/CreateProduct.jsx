import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
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

  useEffect(() => {
    // Check for admin access
    if (!UserService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (!UserService.isAdmin()) {
      navigate("/");
      return;
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduct((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in product) {
        formData.append(key, product[key]);
      }
      
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      navigate('/ProductList');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    }
  };

  return (
    <div className="create-product-container">
      <h2 className="title">New Product</h2>
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
            required 
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn-submit">Submit</button>
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

export default CreateProduct; 