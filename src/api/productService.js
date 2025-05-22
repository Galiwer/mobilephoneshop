import config from "../config";

const BASE_URL = config.apiUrl + "/api/products";

export const getAllProducts = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
};

export const createProduct = async (product) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  return res.json();
};

export const updateProduct = async (id, product) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { 
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
};

export const getImageUrl = (imageFileName) => {
  return `${config.imageUrl}/${imageFileName}`;
};

export const validateProduct = (product) => {
  const requiredFields = ['name', 'brand', 'price', 'category', 'description'];
  const missingFields = requiredFields.filter(field => !product[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (isNaN(parseFloat(product.price)) || parseFloat(product.price) <= 0) {
    throw new Error('Price must be a positive number');
  }

  return true;
}; 