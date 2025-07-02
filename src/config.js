const RAILWAY_URL = "https://backendmobilephone-production.up.railway.app";

export const API_BASE_URL = import.meta.env.VITE_API_URL || RAILWAY_URL;

const config = {
  apiUrl: API_BASE_URL,
  imageUrl: import.meta.env.VITE_IMAGE_URL || `${RAILWAY_URL}/images`,
  isProduction: import.meta.env.NODE_ENV === "production"
};

export default config;
