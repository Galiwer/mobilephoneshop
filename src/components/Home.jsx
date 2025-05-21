import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import api from '../services/api';
import config from '../config';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching products from:', config.apiUrl);
        const data = await api.getProducts();
        console.log('Received products:', data);
        // Only take the first 10 products
        setProducts(data.slice(0, 10));
      } catch (err) {
        console.error('Detailed error:', {
          message: err.message,
          stack: err.stack,
          response: err.response,
        });
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to format price in Rs
  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString('en-IN')}`;
  };

  // Handle image error
  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    e.target.src = '/api/placeholder/300/200';
  };

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="home-container">
      <Banner />
      
      <section className="featured-products">
        <h2 id="products">Featured Products</h2>
        
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
            <div className="debug-info">
              <p>API URL: {config.apiUrl}</p>
              <p>Image URL: {config.imageUrl}</p>
            </div>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="no-products">
            <p>No products available at this time.</p>
            <div className="debug-info">
              <p>API URL: {config.apiUrl}</p>
              <p>Image URL: {config.imageUrl}</p>
            </div>
          </div>
        )}
        
        {!loading && !error && products.length > 0 && (
          <div className="products-showcase">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="product-highlight"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="product-image-wrapper">
                  <img 
                    src={`${config.imageUrl}/${product.imageFileName}`}
                    alt={product.name}
                    onError={handleImageError}
                  />
                  <button className="quick-view-button">Quick View</button>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <span className="product-brand">{product.brand}</span>
                  <p className="product-price">{formatPrice(product.price)}</p>
                </div>
                <Link to={`/product/${product.id}`} className="product-link" aria-label={`View ${product.name}`} />
              </div>
            ))}
          </div>
        )}
        
        <div className="view-all-container">
          <Link to="/products" className="view-all-button">
            View All Products
          </Link>
        </div>
      </section>
      
    </div>
  );
};

export default Home;