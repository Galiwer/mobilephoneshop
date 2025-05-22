import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAdmin } from '../services/UserService';
import './Firmware.css';

const Firmware = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    // Check admin status
    const checkAdminStatus = () => {
      const adminStatus = isAdmin();
      setIsAdminUser(adminStatus);
    };

    checkAdminStatus();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    // Here you would typically handle the file upload to your backend
    setUploadStatus('Uploading...');
    
    // Simulate upload delay
    setTimeout(() => {
      setUploadStatus('Firmware uploaded successfully!');
    }, 2000);
  };

  return (
    <div className="firmware-container">
      <header className="firmware-header">
        <h2>Firmware Update</h2>
        {isAdminUser && (
          <Link to="/FirmwareManager" className="manage-firmware-button">
            Manage Firmware
          </Link>
        )}
      </header>
      <div className="firmware-upload-section">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".bin,.hex"
          className="file-input"
        />
        <button onClick={handleUpload} className="upload-button">
          Upload Firmware
        </button>
      </div>
      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
      <div className="firmware-info">
        <h3>Current Firmware Version</h3>
        <p>Version: 1.0.0</p>
        <p>Last Updated: 2024-03-20</p>
      </div>
    </div>
  );
};

export default Firmware; 