import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import "./progress_update_page.css";

const ProgressUpdate = () => {
  const [jobs, setJobs] = useState([]);
  const [newJobNumber, setNewJobNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for admin access
    if (!UserService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (!UserService.isAdmin()) {
      navigate("/");
      return;
    }

    fetchJobs();
  }, [navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const fetchJobs = async () => {
    try {
      setError(null);
      const { data } = await axios.get(
        "http://localhost:8080/jobs",
        getAuthHeaders()
      );
      
      if (!data) {
        throw new Error('No data received from server');
      }

      setJobs(data);
      const lastNumber =
        data.length > 0
          ? Math.max(...data.map((j) => parseInt(j.jobNumber.replace(/\D/g, ""), 10)))
          : 0;
      setNewJobNumber(`J${lastNumber + 1}`);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to load jobs. Please try again later.");
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
      }
    }
  };

  const statusMap = {
    1: "In Queue",
    2: "Processing",
    3: "Repaired",
  };

  const reverseStatusMap = {
    "In Queue": 1,
    "Processing": 2,
    "Repaired": 3,
  };

  const handleStatusChange = async (jobNumber, newStatusText) => {
    try {
      setError(null);
      await axios.put(
        `http://localhost:8080/job/${jobNumber}/status`,
        reverseStatusMap[newStatusText],
        getAuthHeaders()
      );
      fetchJobs();
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update job status. Please try again.");
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
      }
    }
  };

  const handleDelete = async (jobNumber) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        setError(null);
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/job/${jobNumber}`,
          getAuthHeaders()
        );
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
        setError("Failed to delete job. Please try again.");
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login");
        }
      }
    }
  };

  const handleAddJob = async () => {
    if (!newJobNumber.trim()) return;
    try {
      setError(null);
      await axios.post(
        "http://localhost:8080/job",
        {
          jobNumber: newJobNumber,
          status: 1,
        },
        getAuthHeaders()
      );
      fetchJobs();
    } catch (error) {
      console.error("Error adding job:", error);
      setError("Failed to add job. Please try again.");
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
      }
    }
  };

  const getLastUpdatedDate = (job) => {
    return (
      job.processingDate ||
      job.doneDate ||
      job.queueDate ||
      job.createdAt ||
      null
    );
  };

  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job) =>
    job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="progress-update-page">
      <div className="container">
        <div className="header">
          <h1 className="title">Job Management</h1>
          <div className="add-job">
            <input
              type="text"
              className="input"
              value={newJobNumber}
              onChange={(e) => setNewJobNumber(e.target.value)}
              placeholder="Enter Job Number"
            />
            <button className="add-btn" onClick={handleAddJob}>
              Add Job
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message" style={{ margin: '10px 0', padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search Job Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <table className="job-table">
            <thead>
              <tr>
                <th>Job Number</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Change Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.jobNumber}>
                  <td>{job.jobNumber}</td>
                  <td>
                    <span className={`status-badge status-${job.status}`}>
                      {statusMap[job.status]}
                    </span>
                  </td>
                  <td>
                    {getLastUpdatedDate(job)
                      ? new Date(getLastUpdatedDate(job)).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={statusMap[job.status]}
                      onChange={(e) => handleStatusChange(job.jobNumber, e.target.value)}
                    >
                      <option value="">Change Status</option>
                      <option value="In Queue">In Queue</option>
                      <option value="Processing">Processing</option>
                      <option value="Repaired">Repaired</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(job.jobNumber)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgressUpdate;