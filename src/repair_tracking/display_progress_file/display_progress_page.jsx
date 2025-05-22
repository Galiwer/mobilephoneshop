import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobById } from "../RepairTrackingService";
import "./display_progress_page.css"; // Keep your updated CSS

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
          setStatus(parseInt(data.status)); 
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

  const renderTimeline = () => {
    if (loading) return <p className="loading-text">Loading...</p>;
    if (error) return <p className="error-text">{error}</p>;
    if (status === null) return <p className="loading-text">Job not found or no data available.</p>;

    const steps = [
      { title: "In Queue", detail: "Your job is currently waiting in the queue.", date: updateDates.queue },
      { title: "Processing", detail: "Our technicians are currently working on your device.", date: updateDates.processing },
      { title: "Completed", detail: "Your repair is completed and ready!", date: updateDates.done },
    ];

    return (
      <div className="timeline">
        {steps.map((step, index) => {
          const isActive = status >= index + 1;
          return (
            <div className="timeline-step" key={index}>
              <div className={`step-marker ${isActive ? 'active' : ''}`}>
                {isActive ? <span className="check-icon">✓</span> : ''}
              </div>
              {index !== steps.length - 1 && <div className="step-line"></div>}
              <div className={`step-body ${isActive ? 'active' : 'inactive'}`}>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-detail">{step.detail}</p>
                <p className="step-date">{formatDate(step.date)}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="repair-progress-page">
      <div className="container">
        <div className="repair-status-card">
          <h1 className="heading">Repair Progress</h1>
          <p className="subheading">Tracking for Job Number: <span>{jobNumber}</span></p>
          {renderTimeline()}
        </div>

        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/yourwhatsappphonenumber"
          className="whatsapp-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/124/124034.png"
            alt="Chat on WhatsApp"
            className="whatsapp-icon"
          />
        </a>
      </div>
    </div>
  );
}