import React, { useEffect, useState } from "react";
import { getAllFaqs, deleteFaq, createFaq, updateFaq } from "../api/faqService";
import AddFAQForm from "./AddFAQForm";
import './AdminFAQList.css';

const AdminFAQList = () => {
  const [faqs, setFaqs] = useState([]);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await getAllFaqs();
      setFaqs(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load FAQs. Please try again later.');
      setLoading(false);
      console.error('Error fetching FAQs:', err);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleSubmit = async (faq) => {
    try {
      if (faq.id) {
        await updateFaq(faq.id, faq);
      } else {
        await createFaq(faq);
      }
      loadFaqs();
    } catch (err) {
      setError('Failed to save FAQ. Please try again later.');
      console.error('Error saving FAQ:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await deleteFaq(id);
        loadFaqs();
      } catch (err) {
        setError('Failed to delete FAQ. Please try again later.');
        console.error('Error deleting FAQ:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading FAQs...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-faq-container">
      <header>
        <h1>FAQ Management</h1>
      </header>

      <AddFAQForm 
        onSubmit={handleSubmit} 
        selectedFaq={selectedFaq} 
        clearSelection={() => setSelectedFaq(null)} 
      />

      <div className="faq-list">
        <h2>All FAQs</h2>
        {faqs.map(faq => (
          <div key={faq.id} className="faq-item">
            <div className="faq-header">
              <h3>{faq.question}</h3>
              <div className="faq-actions">
                <button 
                  className="edit-button"
                  onClick={() => setSelectedFaq(faq)}
                >
                  Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(faq.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="faq-details">
              <p className="faq-answer">{faq.answer}</p>
              <div className="faq-meta">
                {faq.category && (
                  <span className="faq-category">Category: {faq.category}</span>
                )}
                <span className={`faq-status ${faq.status.toLowerCase()}`}>
                  {faq.status}
                </span>
                <span className={`faq-active ${faq.active ? 'active' : 'inactive'}`}>
                  {faq.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {faqs.length === 0 && (
        <div className="no-faqs">
          <p>No FAQs available. Add your first FAQ using the form above.</p>
        </div>
      )}
    </div>
  );
};

export default AdminFAQList; 