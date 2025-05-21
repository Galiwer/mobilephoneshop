import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
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
        const response = await fetch('http://localhost:8080/api/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        // Only take the first 10 products
        setProducts(data.slice(0, 10));
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
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
              <div 
                key={product.id} 
                className="product-highlight"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="product-image-wrapper">
                  <img 
                    src={`http://localhost:8080/images/${product.imageFileName}`}
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