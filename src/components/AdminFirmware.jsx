import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/UserService';
import { getAllFirmware, uploadFirmware, deleteFirmware } from '../services/FirmwareService';
import './AdminFirmware.css';

const AdminFirmware = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingFirmware, setExistingFirmware] = useState([]);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    version: '',
    releaseNotes: '',
    firmwareFile: null
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
      console.log('Firmware response:', response); // Debug log
      setExistingFirmware(response.data || []);
    } catch (err) {
      console.error('Error fetching firmware:', err);
      setError('Failed to load existing firmware. Please try again later.');
      setExistingFirmware([]); // Reset on error
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
      formDataToSend.append('firmwareFile', formData.firmwareFile);

      await uploadFirmware(formDataToSend);
      
      // Reset form
      setFormData({
        brand: '',
        model: '',
        version: '',
        releaseNotes: '',
        firmwareFile: null
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
            <label htmlFor="firmwareFile">Firmware File</label>
            <input
              type="file"
              id="firmwareFile"
              name="firmwareFile"
              onChange={handleInputChange}
              accept=".bin,.hex"
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Firmware'}
          </button>
        </form>
      </section>

      {error && <div className="error-message">{error}</div>}

      <section className="existing-firmware-section">
        <h2>Existing Firmware</h2>
        {loading ? (
          <div className="loading">Loading firmware data...</div>
        ) : existingFirmware.length === 0 ? (
          <div className="no-data">No firmware entries found</div>
        ) : (
          <div className="firmware-table-container">
            <table className="firmware-table">
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Version</th>
                  <th>Upload Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {existingFirmware.map((firmware) => (
                  <tr key={firmware.id}>
                    <td>{firmware.brand}</td>
                    <td>{firmware.model}</td>
                    <td>{firmware.version}</td>
                    <td>{new Date(firmware.uploadDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(firmware.id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminFirmware; 