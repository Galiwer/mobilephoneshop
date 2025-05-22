import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserService from '../services/UserService';
import ProductService from '../services/ProductService.jsx';
import config from '../config';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only check admin status
    const checkAdminStatus = () => {
      const adminStatus = UserService.isAdmin();
      setIsAdmin(adminStatus);
    };

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await ProductService.getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
    fetchProducts();
  }, []);

  // Function to format price in Rs
  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString('en-IN')}`;
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

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2 className="products-title">Our Products</h2>
        {isAdmin && (
          <button 
            className="manage-products-button"
            onClick={() => navigate('/ProductList')}
          >
            Manage Products
          </button>
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
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-image-container">
                <img
                  src={`${config.imageUrl}/${product.imageFileName}`}
                  alt={product.name}
                  className="product-image"
                  onClick={() => setSelectedImage(`${config.imageUrl}/${product.imageFileName}`)}
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
};

export default Products;