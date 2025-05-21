const RAILWAY_URL = "https://graceful-strength-production-360f.up.railway.app";

const config = {
  apiUrl: import.meta.env.REACT_APP_API_URL || RAILWAY_URL,
  imageUrl: import.meta.env.REACT_APP_IMAGE_URL || `${RAILWAY_URL}/images`,
  isProduction: import.meta.env.NODE_ENV === "production"
};

export default config;