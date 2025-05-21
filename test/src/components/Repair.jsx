import React from 'react';
import './Repair.css';

const Repair = () => {
  return (
    <div className="repair-container">
      <h2>Repair Services</h2>
      <div className="repair-content">
        <div className="repair-section">
          <h3>Our Repair Services</h3>
          <p>We offer comprehensive repair services for all our products. Our team of certified technicians ensures the highest quality of service.</p>
          
          <div className="repair-options">
            <div className="repair-option">
              <h4>Hardware Repairs</h4>
              <ul>
                <li>Component replacement</li>
                <li>Circuit board repairs</li>
                <li>Physical damage repair</li>
                <li>Connector repairs</li>
              </ul>
            </div>
            
            <div className="repair-option">
              <h4>Software Issues</h4>
              <ul>
                <li>System diagnostics</li>
                <li>Software troubleshooting</li>
                <li>Firmware updates</li>
                <li>Configuration fixes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="repair-contact">
          <h3>Schedule a Repair</h3>
          <p>To schedule a repair service, please contact our support team:</p>
          <div className="contact-info">
            <p>📞 Phone: (555) 123-4567</p>
            <p>✉️ Email: repair@example.com</p>
          </div>
          <button className="schedule-button">Schedule Now</button>
        </div>
      </div>
    </div>
  );
};

export default Repair; 