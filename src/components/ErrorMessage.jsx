import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message }) => {
  // If the message is in JSON format with an error field, extract it
  let displayMessage = message;
  try {
    if (typeof message === 'string' && message.startsWith('{')) {
      const parsed = JSON.parse(message);
      if (parsed.error) {
        displayMessage = parsed.error;
      }
    }
  } catch (e) {
    // If parsing fails, use the original message
    displayMessage = message;
  }

  return (
    <div className="error-message">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <p>{displayMessage}</p>
      </div>
    </div>
  );
};

export default ErrorMessage; 