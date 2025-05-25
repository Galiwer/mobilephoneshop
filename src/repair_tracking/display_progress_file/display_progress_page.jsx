import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobById } from "../RepairTrackingService";
import ErrorMessage from "../../components/ErrorMessage";
import "./display_progress_page.css"; // Keep your updated CSS

const statusOrder = {
  'IN_QUEUE': 1,
  'IN_PROGRESS': 2,
  'COMPLETED': 3
};

export default function RepairProgress() {
  const { state } = useLocation();
  const { jobNumber } = state || {};
  const [status, setStatus] = useState(null);
  const [updateDates, setUpdateDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr)  return "";
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
          setUpdateDates({
            queue : data.queueDate,
            processing : data.processingDate,
            done : data.doneDate,
          });
        } else {
          setError("Job number not found.");
        }
      } catch (error) {
        console.error("Error fetching job data:", error);
        setError(error.message || "Something went wrong while fetching the job data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchRepairData();
  }, [jobNumber]);

  if (loading) {
    return <div className="loading">Loading...</div>;
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
          <div className="progress-tracker">
            <div className={`progress-step ${status >= 1 ? 'active' : ''}`}>
              <div className="step-icon">1</div>
              <div className="step-label">In Queue</div>
              <div className="step-date">{formatDate(updateDates.queue)}</div>
            </div>

            <div className={`progress-step ${status >= 2 ? 'active' : ''}`}>
              <div className="step-icon">2</div>
              <div className="step-label">In Progress</div>
              <div className="step-date">{formatDate(updateDates.processing)}</div>
            </div>

            <div className={`progress-step ${status >= 3 ? 'active' : ''}`}>
              <div className="step-icon">3</div>
              <div className="step-label">Completed</div>
              <div className="step-date">{formatDate(updateDates.done)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}