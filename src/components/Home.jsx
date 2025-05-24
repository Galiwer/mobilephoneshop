import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import { getAllProducts, getImageUrl } from '../api/productService';
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
        const data = await getAllProducts();
        
        setProducts(data.slice(0, 10));
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to format price
  const formatPrice = (price) => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(price);
    return `LKR ${formattedNumber}`;
  };

  // Handle image error
  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    e.target.src = '/api/placeholder/300/200';
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
                    src={getImageUrl(product.imageFileName)}
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