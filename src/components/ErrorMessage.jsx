import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-message-container">
      <div className="error-message-content">
        <div className="error-icon">⚠️</div>
        <p className="error-text">{message}</p>
        {onClose && (
          <button className="error-close-button" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 