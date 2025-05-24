import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAdmin } from '../services/UserService';
import config from '../config';
import './Firmware.css';

const Firmware = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [firmwareList, setFirmwareList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminStatus = isAdmin();
      setIsAdminUser(adminStatus);
    };

    const fetchBrands = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/api/firmware/brands`);
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brands:', error);
        setError('Failed to fetch brands');
      }
    };

    checkAdminStatus();
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (selectedBrand) {
        try {
          const response = await fetch(`${config.apiUrl}/api/firmware/models/${selectedBrand}`);
          const data = await response.json();
          setModels(data);
        } catch (error) {
          console.error('Error fetching models:', error);
          setError('Failed to fetch models');
        }
      } else {
        setModels([]);
      }
    };

    fetchModels();
  }, [selectedBrand]);

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
    setSelectedModel('');
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleDownload = async (firmwareId) => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiUrl}/api/firmware/download/${firmwareId}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const contentType = response.headers.get('content-type');
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'firmware.zip';

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading firmware:', error);
      setError('Failed to download firmware');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="firmware-container">
      <header className="firmware-header">
        <h2>Firmware Downloads</h2>
        {isAdminUser && (
          <Link to="/firmwaremanager" className="manage-firmware-button">
            Manage Firmware
          </Link>
        )}
      </header>

      <div className="firmware-search-section">
        <div className="select-group">
          <label htmlFor="brand">Brand:</label>
          <select
            id="brand"
            value={selectedBrand}
            onChange={handleBrandChange}
            className="select-input"
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="select-group">
          <label htmlFor="model">Model:</label>
          <select
            id="model"
            value={selectedModel}
            onChange={handleModelChange}
            className="select-input"
            disabled={!selectedBrand}
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}

      <div className="firmware-list">
        {firmwareList.map((firmware) => (
          <div key={firmware.id} className="firmware-item">
            <div className="firmware-info">
              <h3>{firmware.brand} {firmware.model}</h3>
              <p>Version: {firmware.version}</p>
              <p>Release Date: {new Date(firmware.createdAt).toLocaleDateString()}</p>
              {firmware.releaseNotes && (
                <p className="release-notes">{firmware.releaseNotes}</p>
              )}
            </div>
            <button
              onClick={() => handleDownload(firmware.id)}
              className="download-button"
              disabled={loading}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Firmware; 