import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobById } from "../RepairTrackingService";
import ErrorMessage from "../../components/ErrorMessage";
import "./display_progress_page.css"; // Keep your updated CSS

const statusOrder = {
  'IN_QUEUE': 1,
  'IN_PROGRESS': 2,
  'COMPLETED': 3
};

const statusInfo = {
  'IN_QUEUE': {
    label: 'In Queue',
    description: 'Your repair request has been received and is waiting to be processed.'
  },
  'IN_PROGRESS': {
    label: 'In Progress',
    description: 'Our technicians are currently working on your device.'
  },
  'COMPLETED': {
    label: 'Completed',
    description: 'Your repair has been completed and is ready for collection.'
  }
};

export default function RepairProgress() {
  const { state } = useLocation();
  const { jobNumber } = state || {};
  const [status, setStatus] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [updateDates, setUpdateDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return "Pending";
    return new Date(dateStr).toLocaleString();
  };

  useEffect(() => {
    const fetchRepairData = async () => {
      if (!jobNumber) {
        setError("No job number provided");
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const data = await getJobById(jobNumber);

        if (data) {
          setStatus(statusOrder[data.status] || 0);
          setCurrentStatus(data.status);
          setUpdateDates({
            queue: data.queueDate,
            processing: data.processingDate,
            done: data.doneDate,
          });
        } else {
          setError("Job number not found.");
        }
      } catch (error) {
        console.error("Error fetching job data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepairData();
  }, [jobNumber]);

  const handleBackToSearch = () => {
    navigate("/repair_tracking/enter_number_file/enter_number_page");
  };

  if (loading) {
    return (
      <div className="repair-progress">
        <div className="progress-container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading repair status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="repair-progress">
      <div className="progress-container">
        <h1>Repair Status for Job {jobNumber}</h1>

        <ErrorMessage 
          message={error} 
          onClose={() => setError(null)}
        />

        {!error && (
          <>
            <div className="progress-tracker">
              <div className={`progress-step ${status >= 1 ? 'active' : ''}`}>
                <div className="step-icon">1</div>
                <div className="step-content">
                  <div className="step-label">In Queue</div>
                  <div className="step-date">{formatDate(updateDates.queue)}</div>
                  <div className="step-description">
                    {statusInfo['IN_QUEUE'].description}
                  </div>
                </div>
              </div>

              <div className={`progress-step ${status >= 2 ? 'active' : ''}`}>
                <div className="step-icon">2</div>
                <div className="step-content">
                  <div className="step-label">In Progress</div>
                  <div className="step-date">{formatDate(updateDates.processing)}</div>
                  <div className="step-description">
                    {statusInfo['IN_PROGRESS'].description}
                  </div>
                </div>
              </div>

              <div className={`progress-step ${status >= 3 ? 'active' : ''}`}>
                <div className="step-icon">3</div>
                <div className="step-content">
                  <div className="step-label">Completed</div>
                  <div className="step-date">{formatDate(updateDates.done)}</div>
                  <div className="step-description">
                    {statusInfo['COMPLETED'].description}
                  </div>
                </div>
              </div>
            </div>

            <div className="current-status">
              <h2>Current Status: {currentStatus && statusInfo[currentStatus].label}</h2>
              <p>{currentStatus && statusInfo[currentStatus].description}</p>
            </div>

            <button onClick={handleBackToSearch} className="back-button">
              Track Another Repair
            </button>
          </>
        )}
      </div>
    </div>
  );
}