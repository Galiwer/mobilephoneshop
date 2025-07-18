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
        if (!response.ok) throw new Error('Failed to fetch brands');
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
          if (!response.ok) throw new Error('Failed to fetch models');
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
      setError(null);
      
      const response = await fetch(`${config.apiUrl}/api/firmware/download/${firmwareId}`);
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const data = await response.json();
      
      if (!data || !data.type) {
        throw new Error('Invalid firmware response received');
    }

      if (data.type === 'link') {
        // For Google Drive links, open in new tab
        window.open(data.url, '_blank');
      } else if (data.type === 'file') {
        // For direct downloads
        const downloadResponse = await fetch(data.url);
        if (!downloadResponse.ok) {
          throw new Error('File download failed');
        }

        const blob = await downloadResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = data.fileName || 'firmware.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Invalid firmware type received');
      }
    } catch (error) {
      console.error('Error downloading firmware:', error);
      setError(`Failed to download firmware: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add function to fetch firmware list when model is selected
  useEffect(() => {
    const fetchFirmwareList = async () => {
      if (selectedBrand && selectedModel) {
        try {
          setLoading(true);
          const response = await fetch(`${config.apiUrl}/api/firmware/list/${selectedBrand}/${selectedModel}`);
          if (!response.ok) throw new Error('Failed to fetch firmware list');
          const data = await response.json();
          setFirmwareList(data);
        } catch (error) {
          console.error('Error fetching firmware list:', error);
          setError('Failed to fetch firmware list');
        } finally {
          setLoading(false);
        }
      } else {
        setFirmwareList([]);
      }
    };

    fetchFirmwareList();
  }, [selectedBrand, selectedModel]);

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
        {firmwareList.length === 0 && selectedBrand && selectedModel ? (
          <div className="no-firmware">No firmware available for selected model</div>
        ) : (
          firmwareList.map((firmware) => (
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
                {loading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Firmware; 