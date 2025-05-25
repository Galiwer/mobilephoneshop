import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ErrorHandler.css';

// Error types and their corresponding toast configurations
const ERROR_TYPES = {
  JOB_NOT_FOUND: {
    type: 'error',
    title: 'Job Not Found',
    icon: '🔍'
  },
  INVALID_JOB_NUMBER: {
    type: 'warning',
    title: 'Invalid Job Number',
    icon: '⚠️'
  },
  SERVER_ERROR: {
    type: 'error',
    title: 'Server Error',
    icon: '🔥'
  },
  NETWORK_ERROR: {
    type: 'error',
    title: 'Network Error',
    icon: '🌐'
  },
  DEFAULT: {
    type: 'error',
    title: 'Error',
    icon: '❌'
  }
};

export const showError = (error) => {
  let errorConfig = ERROR_TYPES.DEFAULT;
  let errorMessage = error?.message || 'An unexpected error occurred';

  // Handle specific error types based on the error response
  if (error?.response?.data?.error) {
    if (error.response.data.error.includes('Job not found')) {
      errorConfig = ERROR_TYPES.JOB_NOT_FOUND;
      errorMessage = error.response.data.error;
    } else if (error.response.data.error.includes('Invalid job number format')) {
      errorConfig = ERROR_TYPES.INVALID_JOB_NUMBER;
      errorMessage = error.response.data.error;
    }
  } else if (error?.message === 'Network Error') {
    errorConfig = ERROR_TYPES.NETWORK_ERROR;
    errorMessage = 'Unable to connect to the server. Please check your internet connection.';
  } else if (error?.response?.status === 500) {
    errorConfig = ERROR_TYPES.SERVER_ERROR;
    errorMessage = 'An internal server error occurred. Please try again later.';
  }

  toast.error(
    <div className="error-toast">
      <div className="error-toast-title">
        <span className="error-toast-icon">{errorConfig.icon}</span>
        <strong>{errorConfig.title}</strong>
      </div>
      <div className="error-toast-message">{errorMessage}</div>
    </div>,
    {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: `error-toast-container ${errorConfig.type}`,
    }
  );
};

const ErrorHandler = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default ErrorHandler; 