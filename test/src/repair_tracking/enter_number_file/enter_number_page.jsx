import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import "./enter_number_page.css";

export default function EnterNumberPage() {
  const [jobNumber, setJobNumber] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      // Log the current state
      console.log('Current auth state:', {
        hasToken: !!token,
        role: role,
        roleType: typeof role,
        isExactlyAdmin: role === 'ADMIN',
        isAdminService: UserService.isAdmin(),
        isAuthenticatedService: UserService.isAuthenticated(),
        localStorage: {
          token: token ? 'present' : 'missing',
          role: role || 'missing'
        }
      });

      // Check if user is admin
      const adminCheck = token && (role === 'ADMIN');
      console.log('Admin check result:', adminCheck);
      
      setIsAdmin(adminCheck);
    };

    // Check immediately
    checkAdminStatus();

    // Set up interval to check periodically
    const interval = setInterval(checkAdminStatus, 1000);

    // Clean up
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedJobNumber = jobNumber.trim();
    if (!trimmedJobNumber) {
      alert("Please enter a valid job number.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/job/${trimmedJobNumber}`);

      if (response.data) {
        navigate("/repair_tracking/display_progress_file/display_progress_page", {
          state: { jobNumber: trimmedJobNumber },
        });
      } else {
        alert("Job number not found.");
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
      alert("An error occurred while fetching the job data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAccess = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('Admin access attempt:', {
      hasToken: !!token,
      role: role,
      isAdmin: role === 'ADMIN'
    });

    if (!token) {
      console.log('No token found, redirecting to login');
      navigate("/login");
      return;
    }
    
    if (role !== 'ADMIN') {
      console.log('Not admin role:', role);
      alert("You need administrator privileges to access this page.");
      return;
    }
    
    console.log('Admin access granted, navigating to progress update page');
    navigate("/repair_tracking/progress_update_file/progress_update_page");
  };

  return (
    <div className="repair-tracking-page">
      <div className="container">
        <div className="card">
          <h1 className="title">Repair Tracking</h1>
          

          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="jobNumber" className="label">
                Job Number
              </label>
              <input
                id="jobNumber"
                type="text"
                value={jobNumber}
                onChange={(e) => setJobNumber(e.target.value)}
                className="input"
                placeholder="Eg: 12345"
              />
            </div>

            <div className="button-group">
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? "Tracking..." : "Track"}
              </button>
              {isAdmin && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleAdminAccess}
                >
                  Admin
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}