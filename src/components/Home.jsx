import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import { isAuthenticated } from '../services/UserService';
import config from '../config';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsUserAuthenticated(authStatus);
    };

    checkAuth();
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.apiUrl}/api/products`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        // Only take the first 10 products
        setProducts(data.slice(0, 10));
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products');
        
        // Handle authentication errors
        if (err.status === 401) {
          setError('Please log in to view products');
          navigate('/login', { state: { from: '/' } });
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  // Function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Handle image error
  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    e.target.src = '/api/placeholder/300/200';
  };

  // Handle login click
  const handleLoginClick = () => {
    navigate('/login', { state: { from: '/' } });
  };

  return (
    <div className="home-container">
      <Banner />
      
      <section className="featured-products">
        <div className="section-header">
          <h2 id="products">Featured Products</h2>
        </div>
        
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        )}
        

        {!loading && !error && products.length === 0 && (
          <div className="no-products">
            <p>No products available at this time.</p>
          </div>
        )}
        
        {!loading && !error && products.length > 0 && (
          <div className="products-showcase">
            {products.map((product) => (
              <div key={product.id} className="product-highlight">
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
      
      <Footer />
    </div>
  );
};

export default Home;