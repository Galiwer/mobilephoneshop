const RAILWAY_URL = "https://graceful-strength-production-360f.up.railway.app";

const config = {
  apiUrl: import.meta.env.VITE_API_URL || RAILWAY_URL,
  imageUrl: import.meta.env.VITE_IMAGE_URL || `${RAILWAY_URL}/images`,
  isProduction: import.meta.env.NODE_ENV === "production"
};

export default config;