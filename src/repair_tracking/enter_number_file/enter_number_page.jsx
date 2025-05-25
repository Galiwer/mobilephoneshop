import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../../services/UserService";
import { getJobById } from "../RepairTrackingService";
import ErrorMessage from "../../components/ErrorMessage";
import "./enter_number_page.css";

export default function EnterNumberPage() {
  const [jobNumber, setJobNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin status once on component mount
    const checkAdminStatus = () => {
      try {
        const authStatus = isAuthenticated();
        const adminStatus = isAdmin();
        setIsAdminUser(authStatus && adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdminUser(false);
      }
    };

    checkAdminStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedJobNumber = jobNumber.trim();

    if (!trimmedJobNumber) {
      setError("Please enter a valid job number.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const jobData = await getJobById(trimmedJobNumber);

      if (jobData) {
        navigate("/repair_tracking/display_progress_file/display_progress_page", {
          state: { jobNumber: trimmedJobNumber },
        });
      } else {
        setError("Job number not found.");
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
      setError(error.message || "Job number not found or an error occurred. Please check the number and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAccess = () => {
    try {
      if (!isAuthenticated()) {
        navigate("/login", { 
          state: { 
            returnUrl: "/repair_tracking/progress_update_file/progress_update_page" 
          } 
        });
        return;
      }

      if (!isAdmin()) {
        setError("You need administrator privileges to access this page.");
        return;
      }

      navigate("/repair_tracking/progress_update_file/progress_update_page");
    } catch (error) {
      console.error('Error during admin access:', error);
      setError("An error occurred while checking permissions. Please try again.");
    }
  };

  return (
    <div className="repair-tracking-page">
      <div className="container">
        <div className="card">
          <h1 className="title">Repair Tracking</h1>
          
          <ErrorMessage 
            message={error} 
            onClose={() => setError(null)}
          />

          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="jobNumber" className="label">
                Job Number
              </label>
              <input
                id="jobNumber"
                type="text"
                value={jobNumber}
                onChange={(e) => {
                  setJobNumber(e.target.value);
                  setError(null); // Clear error when user types
                }}
                className="input"
                placeholder="Enter your job number"
                disabled={loading}
              />
            </div>

            <div className="button-group">
              <button 
                type="submit" 
                className="primary-button" 
                disabled={loading}
              >
                {loading ? (
                  <span>
                    <i className="fas fa-spinner fa-spin"></i> Tracking...
                  </span>
                ) : (
                  "Track Repair"
                )}
              </button>
              
              {isAdminUser && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleAdminAccess}
                  disabled={loading}
                >
                  Admin Dashboard
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}