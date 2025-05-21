import config from '../config';

const BASE_URL = `${config.apiUrl}/api/faqs`;

export const getAllFaqs = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const createFaq = async (faq) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(faq),
  });
  return res.json();
};

export const updateFaq = async (id, faq) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(faq),
  });
  return res.json();
};

export const deleteFaq = async (id) => {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}; 