import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAdmin } from '../services/UserService';
import { getAllProducts } from '../api/productService';
import config from '../config';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = () => {
      const adminStatus = isAdmin();
      setIsUserAdmin(adminStatus);
    };

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getAllProducts();
        console.log('Raw API response:', response);

        // Ensure we have an array of products
        const productsArray = Array.isArray(response) ? response : 
                            Array.isArray(response.data) ? response.data :
                            Array.isArray(response.products) ? response.products : [];

        console.log('Processed products array:', productsArray);
        setProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
    fetchProducts();
  }, []);

  // Function to format price in Rs
  const formatPrice = (price) => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(price);
    return `LKR ${formattedNumber}`;
  };

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = '/api/placeholder/300/300';
  };

  // Handle manage products click
  const handleManageProducts = (e) => {
    e.preventDefault();
    navigate('/productlist');
  };

  const handleImageClick = (e, imageUrl) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImage(imageUrl);
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2 className="products-title">Our Products</h2>
        {isUserAdmin && (
          <Link 
            to="/productlist"
            className="manage-products-button"
          >
            Manage Products
          </Link>
        )}
      </div>
      
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <p>Error loading products: {error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      )}
      
      {!loading && !error && products.length === 0 && (
        <div className="no-products">
          <p>No products available at this time.</p>
        </div>
      )}
      
      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <div 
              className="product-card" 
              key={product.id}
            >
              <div className="product-image-container">
                <img
                  src={`${config.imageUrl}/${product.imageFileName}`}
                  alt={product.name}
                  className="product-image"
                  onClick={(e) => handleImageClick(e, `${config.imageUrl}/${product.imageFileName}`)}
                  onError={handleImageError}
                />
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-meta">
                  <span className="product-brand">{product.brand}</span>
                  <span className="product-category">{product.category}</span>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">{formatPrice(product.price)}</span>
                  <span className="product-date">Added: {formatDate(product.createdAt)}</span>
                </div>
              </div>
              <Link to={`/product/${product.id}`} className="product-link" aria-label={`View ${product.name}`} />
            </div>
          ))}
        </div>
      )}
      
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <button className="close-modal" onClick={() => setSelectedImage(null)}>×</button>
            <img src={selectedImage} alt="Product Preview" className="modal-image" onError={handleImageError} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;