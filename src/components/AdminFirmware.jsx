import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/UserService';
import { getAllFirmware, uploadFirmware, deleteFirmware, downloadFirmware } from '../services/FirmwareService';
import './AdminFirmware.css';

const AdminFirmware = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingFirmware, setExistingFirmware] = useState([]);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    version: '',
    releaseNotes: '',
    firmwareFile: null,
    firmwareLink: ''
  });

  useEffect(() => {
    // Check for admin access
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (!isAdmin()) {
      navigate("/");
      return;
    }

    fetchExistingFirmware();
  }, [navigate]);

  const fetchExistingFirmware = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllFirmware();
      console.log('Firmware response:', response);
      setExistingFirmware(response.data || []);
    } catch (err) {
      console.error('Error fetching firmware:', err);
      setError('Failed to load existing firmware. Please try again later.');
      setExistingFirmware([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const validateGoogleDriveLink = (link) => {
    // Basic validation for Google Drive link
    return link.includes('drive.google.com') && link.includes('/file/d/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const formDataToSend = new FormData();
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('model', formData.model);
      formDataToSend.append('version', formData.version);
      formDataToSend.append('releaseNotes', formData.releaseNotes || '');

      if (uploadType === 'file' && formData.firmwareFile) {
        formDataToSend.append('firmwareFile', formData.firmwareFile);
      } else if (uploadType === 'link' && formData.firmwareLink) {
        if (!validateGoogleDriveLink(formData.firmwareLink)) {
          throw new Error('Please enter a valid Google Drive link');
        }
        formDataToSend.append('firmwareLink', formData.firmwareLink);
      } else {
        throw new Error('Please provide either a firmware file or a Google Drive link');
      }

      await uploadFirmware(formDataToSend);
      
      // Reset form
      setFormData({
        brand: '',
        model: '',
        version: '',
        releaseNotes: '',
        firmwareFile: null,
        firmwareLink: ''
      });

      // Reset file input
      const fileInput = document.getElementById('firmwareFile');
      if (fileInput) {
        fileInput.value = '';
      }

      // Refresh firmware list
      await fetchExistingFirmware();

    } catch (err) {
      console.error('Error uploading firmware:', err);
      setError(err.message || 'Failed to upload firmware. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (firmwareId) => {
    if (!window.confirm('Are you sure you want to delete this firmware?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteFirmware(firmwareId);
      await fetchExistingFirmware();
    } catch (err) {
      console.error('Error deleting firmware:', err);
      setError(err.message || 'Failed to delete firmware. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (firmwareId) => {
    try {
      setLoading(true);
      setError(null);
      const downloadData = await downloadFirmware(firmwareId);

      if (downloadData.type === 'link') {
        window.open(downloadData.url, '_blank');
      } else if (downloadData.type === 'file') {
        const a = document.createElement('a');
        a.href = downloadData.url;
        a.download = downloadData.fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadData.url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error downloading firmware:', err);
      setError('Failed to download firmware. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-firmware-container">
      <header>
        <h1>Firmware Management</h1>
        <Link to="/FirmwareManager" className="back-link">
          Back to Download Page
        </Link>
      </header>

      <section className="upload-section">
        <h2>Upload New Firmware</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="version">Version</label>
            <input
              type="text"
              id="version"
              name="version"
              value={formData.version}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="releaseNotes">Release Notes</label>
            <textarea
              id="releaseNotes"
              name="releaseNotes"
              value={formData.releaseNotes}
              onChange={handleInputChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Upload Type</label>
            <div className="upload-type-selector">
              <label>
                <input
                  type="radio"
                  name="uploadType"
                  value="file"
                  checked={uploadType === 'file'}
                  onChange={(e) => setUploadType(e.target.value)}
                />
                Upload File
              </label>
              <label>
                <input
                  type="radio"
                  name="uploadType"
                  value="link"
                  checked={uploadType === 'link'}
                  onChange={(e) => setUploadType(e.target.value)}
                />
                Google Drive Link
              </label>
            </div>
          </div>

          {uploadType === 'file' ? (
            <div className="form-group">
              <label htmlFor="firmwareFile">Firmware File</label>
              <input
                type="file"
                id="firmwareFile"
                name="firmwareFile"
                onChange={handleInputChange}
                accept=".bin,.hex,.zip"
                required={uploadType === 'file'}
              />
              <small>Accepted formats: .bin, .hex, .zip</small>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="firmwareLink">Google Drive Link</label>
              <input
                type="url"
                id="firmwareLink"
                name="firmwareLink"
                value={formData.firmwareLink}
                onChange={handleInputChange}
                placeholder="https://drive.google.com/file/d/..."
                required={uploadType === 'link'}
              />
              <small>Please provide a public Google Drive link to the firmware file</small>
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Firmware'}
          </button>
        </form>
      </section>

      {error && <div className="error-message">{error}</div>}

      <section className="existing-firmware">
        <h2>Existing Firmware</h2>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        
        <div className="firmware-list">
          {existingFirmware.map((firmware) => (
            <div key={firmware.id} className="firmware-item">
              <div className="firmware-details">
                <h3>{firmware.brand} {firmware.model}</h3>
                <p className="version">Version: {firmware.version}</p>
                <p className="type">Type: {firmware.firmwareLink ? 'Google Drive Link' : 'Uploaded File'}</p>
                {firmware.releaseNotes && (
                  <p className="notes">{firmware.releaseNotes}</p>
                )}
                <p className="upload-date">
                  Uploaded: {new Date(firmware.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="firmware-actions">
                <button
                  onClick={() => handleDownload(firmware.id)}
                  className="download-button"
                  disabled={loading}
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(firmware.id)}
                  className="delete-button"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminFirmware; 