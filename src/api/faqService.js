import config from "../config";
import { getToken } from '../services/UserService';

const BASE_URL = config.apiUrl + "/api/faqs";

export const getAllFaqs = async () => {
  try {
    const res = await fetch(`${BASE_URL}/published`);
    if (!res.ok) {
      throw new Error('Failed to fetch FAQs');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw error;
  }
};

export const getAllFaqsAdmin = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) {
      throw new Error('Failed to fetch FAQs');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw error;
  }
};

export const createFaq = async (faq) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(faq),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create FAQ');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error creating FAQ:', error);
    throw error;
  }
};

export const updateFaq = async (id, faq) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(faq),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update FAQ');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error updating FAQ:', error);
    throw error;
  }
};

export const deleteFaq = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { 
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete FAQ');
    }
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    throw error;
  }
}; 