import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getAllFaqs } from "../api/faqService";
import UserService from "../services/UserService";
import './FAQList.css';

const FAQList = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getAllFaqs();
        const publishedFaqs = data.filter(f => f.status === "Published" && f.active);
        setFaqs(publishedFaqs);
        setLoading(false);
      } catch (err) {
        setError('Failed to load FAQs. Please try again later.');
        setLoading(false);
        console.error('Error fetching FAQs:', err);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return <div className="loading">Loading FAQs...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="faq-list-container">
      <header>
        <h1>Frequently Asked Questions</h1>
        {UserService.isAdmin() && (
          <Link to="/admin/faq" className="admin-button">
            Manage FAQs
          </Link>
        )}
      </header>

      <div className="info-box">
        <p>Find answers to common questions about our products and services.</p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="faq-item">
            <div
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              <h3>{faq.question}</h3>
              <span className="faq-icon">
                {openIndex === index ? '−' : '+'}
              </span>
            </div>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
                {faq.category && (
                  <span className="faq-category">Category: {faq.category}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {faqs.length === 0 && (
        <div className="no-faqs">
          <p>No FAQs available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default FAQList; 