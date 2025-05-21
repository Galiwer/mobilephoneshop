import React, { useState, useEffect } from "react";
import './AddFAQForm.css';

const AddFAQForm = ({ onSubmit, selectedFaq, clearSelection }) => {
  const [faq, setFaq] = useState({
    question: "",
    answer: "",
    category: "",
    status: "Draft",
    active: true
  });

  useEffect(() => {
    if (selectedFaq) setFaq(selectedFaq);
  }, [selectedFaq]);

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFaq({ ...faq, [e.target.name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(faq);
    if (!selectedFaq) {
      setFaq({ question: "", answer: "", category: "", status: "Draft", active: true });
    }
    if (clearSelection) clearSelection();
  };

  return (
    <form className="add-faq-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="question">Question</label>
        <input
          id="question"
          name="question"
          value={faq.question}
          onChange={handleChange}
          placeholder="Enter your question"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="answer">Answer</label>
        <textarea
          id="answer"
          name="answer"
          value={faq.answer}
          onChange={handleChange}
          placeholder="Enter the answer"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          value={faq.category}
          onChange={handleChange}
          placeholder="Enter category (optional)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={faq.status}
          onChange={handleChange}
        >
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            name="active"
            checked={faq.active}
            onChange={handleChange}
          />
          Active
        </label>
      </div>

      <button type="submit" className="submit-button">
        {selectedFaq ? "Update FAQ" : "Add FAQ"}
      </button>
    </form>
  );
};

export default AddFAQForm; 