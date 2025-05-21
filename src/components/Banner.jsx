import { useState, useEffect } from 'react';
import './Banner.css';
import K1 from '../assets/ciro/K1.jpg';
import K2 from '../assets/ciro/K2.jpg';
import K3 from '../assets/ciro/K3.jpg';
import arrowPrev from '../assets/logo/arrow-prev.webp';
import arrowNext from '../assets/logo/arrow-next.webp';

const banners = [
  {
    id: 1,
    imgSrc: K1,
    heading: "The Ultimate Phone Buyer's Guide\nNavigating the world of\nMobile Phones",
  },
  {
    id: 2,
    imgSrc: K2,
    heading: "Find Your Perfect Phone\nExplore the Latest in Mobile Technology",
  },
  {
    id: 3,
    imgSrc: K3,
    heading: "Reliable Communication, Simplified\nExplore the Best Feature Phones Today",
  },
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleBannerChange = (next = true) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        next ? (prev + 1) % banners.length : (prev - 1 + banners.length) % banners.length
      );
      setIsFading(false);
    }, 300);
  };

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        handleBannerChange(true);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const { heading, imgSrc, id } = banners[currentIndex];

  return (
    <section 
      className={`Banner ${isFading ? 'fade' : ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide indicators */}
      <div className="slide-indicators">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setCurrentIndex(index);
              setIsPaused(true);
            }}
          />
        ))}
      </div>

      <div className="banner-left">
        <h2>{heading}</h2>
        <div className="explore-now-btn" onClick={scrollToProducts}>
          <div>Explore Now</div>
          <img src={arrowNext} alt="arrow-next" />
        </div>
      </div>

      <div className="banner-right">
        <img src={imgSrc} alt={`Banner ${id}`} />
      </div>

      {/* Arrow buttons */}
      <button 
        className="arrow-btn prev" 
        onClick={() => {
          handleBannerChange(false);
          setIsPaused(true);
        }}
      >
        <img src={arrowPrev} alt="arrow-prev" />
      </button>
      <button 
        className="arrow-btn next" 
        onClick={() => {
          handleBannerChange(true);
          setIsPaused(true);
        }}
      >
        <img src={arrowNext} alt="arrow-next" />
      </button>
    </section>
  );
};

export default Banner;
