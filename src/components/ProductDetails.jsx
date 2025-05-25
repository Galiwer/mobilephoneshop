import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../api/productService';
import config from '../config';
import './ProductDetails.css';

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="whatsapp-icon">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
  </svg>
);

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
        const data = await getProductById(id);
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const generateWhatsAppMessage = (product) => {
    const message = `Hi! I'm interested in purchasing:\n\n` +
      `Product: ${product.name}\n` +
      `Brand: ${product.brand}\n` +
      `Price: ${formatPrice(product.price)}\n\n` +
      `Please provide more information about availability and payment options.`;
    return encodeURIComponent(message);
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
              src={`${config.imageUrl}/${product.imageFileName}`}
              alt={product.name}
              onError={handleImageError}
              className="product-details-image"
              onClick={() => setSelectedImage(`${config.imageUrl}/${product.imageFileName}`)}
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

          <div className="purchase-section">
            <div className="price-container">
              <span className="price-label">Price:</span>
              <span className="product-price">{formatPrice(product.price)}</span>
            </div>
            
            <div className="contact-purchase">
              <p className="purchase-info">
                To purchase this product, please contact us via WhatsApp for availability and payment details.
              </p>
              <a
                href={`https://wa.me/+94777123456?text=${generateWhatsAppMessage(product)}`}
                className="whatsapp-contact-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="whatsapp-button-content">
                  <WhatsAppIcon />
                  <span>Contact to Purchase</span>
                </div>
              </a>
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