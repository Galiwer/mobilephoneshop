const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://graceful-strength-production-360f.up.railway.app',
  imageUrl: process.env.REACT_APP_IMAGE_URL || 'https://graceful-strength-production-360f.up.railway.app/images',
  isProduction: process.env.NODE_ENV === 'production'
};

export default config; 