import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Function to format price in Rs
  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString('en-IN')}`;
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = '/api/placeholder/500/500';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-error">
        <h2>Error loading product</h2>
        <p>{error}</p>
        <Link to="/" className="back-to-home">Return to Home</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/" className="back-to-home">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <nav className="product-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span>{product.name}</span>
      </nav>

      <div className="product-details-content">
        <div className="product-details-left">
          <div className="product-image-container">
            <img
              src={`http://localhost:8080/images/${product.imageFileName}`}
              alt={product.name}
              onError={handleImageError}
              className="product-details-image"
              onClick={() => setSelectedImage(`http://localhost:8080/images/${product.imageFileName}`)}
            />
            <div className="image-overlay">
              <span>Click to zoom</span>
            </div>
          </div>
        </div>

        <div className="product-details-right">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-meta">
              <span className="product-brand">{product.brand}</span>
              {product.category && (
                <span className="product-category">{product.category}</span>
              )}
            </div>
          </div>

          <div className="product-price-section">
            <div className="price-container">
              <span className="current-price">{formatPrice(product.price)}</span>
              <span className="price-note">Inclusive of all taxes</span>
            </div>
            <div className="availability-status">
              <span className="in-stock">✓ In Stock</span>
            </div>
          </div>

          <div className="product-description">
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>

          {product.specifications && product.specifications.length > 0 && (
            <div className="product-specs">
              <h2>Key Features</h2>
              <ul>
                {product.specifications.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </div>
          )}

          {product.additionalInfo && (
            <div className="additional-info">
              <h2>Additional Information</h2>
              <p>{product.additionalInfo}</p>
            </div>
          )}

          <div className="product-footer">
            <div className="product-meta-info">
              <span className="product-id">Product ID: {product.id}</span>
              <span className="product-added">Listed on: {formatDate(product.createdAt)}</span>
            </div>
            <Link to="/products" className="browse-more-link">
              Browse More Products
            </Link>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <button className="close-modal" onClick={() => setSelectedImage(null)}>×</button>
            <img 
              src={selectedImage} 
              alt="Product Preview" 
              className="modal-image" 
              onError={handleImageError}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails; 