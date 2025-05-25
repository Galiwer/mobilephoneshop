import React from 'react';
import PropTypes from 'prop-types';
import './JobError.css';

const JobError = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className="job-error-container">
      <div className="job-error-content">
        <div className="job-error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12" y2="16" />
          </svg>
        </div>
        <h3 className="job-error-title">Error</h3>
        <p className="job-error-message">{error.message || 'An unexpected error occurred'}</p>
        {error.details && (
          <div className="job-error-details">
            <pre>{JSON.stringify(error.details, null, 2)}</pre>
          </div>
        )}
        {onRetry && (
          <button className="job-error-retry" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

JobError.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
    details: PropTypes.any
  }),
  onRetry: PropTypes.func
};

export default JobError; 