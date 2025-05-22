import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import RepairTrackingService from "../RepairTrackingService";
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

  const fetchJobs = async () => {
    try {
      setError(null);
      const data = await RepairTrackingService.getAllJobs();
      
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
      setError(error.message || "Failed to load jobs. Please try again later.");
      if (error.status === 401 || error.status === 403) {
        navigate("/login");
      }
    }
  };

  const handleStatusChange = async (jobNumber, newStatusText) => {
    try {
      setError(null);
      const statusCode = RepairTrackingService.getStatusCode(newStatusText);
      await RepairTrackingService.updateJobStatus(jobNumber, statusCode);
      fetchJobs();
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.message || "Failed to update job status. Please try again.");
      if (error.status === 401 || error.status === 403) {
        navigate("/login");
      }
    }
  };

  const handleDelete = async (jobNumber) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        setError(null);
        await RepairTrackingService.deleteJob(jobNumber);
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
        setError(error.message || "Failed to delete job. Please try again.");
        if (error.status === 401 || error.status === 403) {
          navigate("/login");
        }
      }
    }
  };

  const handleAddJob = async () => {
    if (!newJobNumber.trim()) return;
    try {
      setError(null);
      await RepairTrackingService.createJob({
        jobNumber: newJobNumber,
        status: 1,
      });
      fetchJobs();
    } catch (error) {
      console.error("Error adding job:", error);
      setError(error.message || "Failed to add job. Please try again.");
      if (error.status === 401 || error.status === 403) {
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
                  <td>{RepairTrackingService.getStatusText(job.status)}</td>
                  <td>
                    {getLastUpdatedDate(job)
                      ? new Date(getLastUpdatedDate(job)).toLocaleString()
                      : "Not available"}
                  </td>
                  <td>
                    <select
                      value={RepairTrackingService.getStatusText(job.status)}
                      onChange={(e) =>
                        handleStatusChange(job.jobNumber, e.target.value)
                      }
                      className="status-select"
                    >
                      {Object.values(RepairTrackingService.statusMap).map(
                        (status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(job.jobNumber)}
                      className="delete-btn"
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