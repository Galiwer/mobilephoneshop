import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { isAdmin } from '../services/UserService'
import './FirmwareManager.css'
import { getAllBrands, getModelsByBrand, getFirmwareVersions, downloadFirmware } from '../services/FirmwareService'

function FirmwareManager() {
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [availableBrands, setAvailableBrands] = useState([])
  const [availableModels, setAvailableModels] = useState([])
  const [firmwareVersions, setFirmwareVersions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAdminUser, setIsAdminUser] = useState(false)

  // Check admin status and fetch brands when component mounts
  useEffect(() => {
    const checkAdminStatus = () => {
      const adminStatus = isAdmin();
      setIsAdminUser(adminStatus);
    };

    checkAdminStatus();
    fetchBrands();
  }, [])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      setError(null)
      const brands = await getAllBrands()
      setAvailableBrands(Array.isArray(brands) ? brands : [])
      setLoading(false)
    } catch (err) {
      setError('Failed to load brands. Please try again later.')
      setLoading(false)
      console.error('Error fetching brands:', err)
    }
  }

  const handleBrandChange = async (e) => {
    const brand = e.target.value
    setSelectedBrand(brand)
    setSelectedModel('')
    setFirmwareVersions([])
    
    if (brand) {
      try {
        setLoading(true)
        setError(null)
        const models = await getModelsByBrand(brand)
        setAvailableModels(Array.isArray(models) ? models : [])
        setLoading(false)
      } catch (err) {
        setError('Failed to load models. Please try again later.')
        setLoading(false)
        console.error('Error fetching models:', err)
      }
    } else {
      setAvailableModels([])
    }
  }

  const handleModelChange = async (e) => {
    const model = e.target.value
    setSelectedModel(model)
    
    if (selectedBrand && model) {
      try {
        setLoading(true)
        setError(null)
        const firmware = await getFirmwareVersions(selectedBrand, model)
        setFirmwareVersions(Array.isArray(firmware) ? firmware : [])
        setLoading(false)
      } catch (err) {
        setError('Failed to load firmware versions. Please try again later.')
        setLoading(false)
        console.error('Error fetching firmware versions:', err)
      }
    } else {
      setFirmwareVersions([])
    }
  }

  const handleDownload = async (firmwareId) => {
    if (!firmwareId) {
      setError('Download not available')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const downloadData = await downloadFirmware(firmwareId)

      if (downloadData.type === 'link') {
        // For Google Drive links, open in new tab
        window.open(downloadData.url, '_blank')
      } else if (downloadData.type === 'file') {
        // For direct file downloads
        const a = document.createElement('a')
        a.href = downloadData.url
        a.download = downloadData.fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(downloadData.url)
        document.body.removeChild(a)
      }
    } catch (err) {
      console.error('Error downloading firmware:', err)
      setError('Failed to download firmware. Please try again later.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="firmware-manager-container">
      <header>
        <h1>Download Phone OS</h1>
        <div className="header-actions">
          {isAdminUser && (
            <Link to="/admin/firmware" className="admin-button">
              Manage Firmware
            </Link>
          )}
        </div>
      </header>
      
      <div className="current-release">
        <h2>Current release: OS 2025 - Version 4.0</h2>
        <p>Latest stable firmware for all devices</p>
      </div>
      
      <div className="info-box">
        <p><strong>Important:</strong> Please download the correct OS version below for your device.</p>
        <p><strong>Note:</strong> Download the Toolkit to install the firmware successfully.</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <section className="select-device-section">
        <h2>Select Your Device</h2>
        
        <div className="form-group">
          <label htmlFor="select-brand">Select Brand</label>
          <select 
            id="select-brand" 
            value={selectedBrand} 
            onChange={handleBrandChange}
            disabled={loading}
          >
            <option value="">Select Brand</option>
            {availableBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        
        {selectedBrand && (
          <div className="form-group">
            <label htmlFor="select-model">Select Model</label>
            <select 
              id="select-model" 
              value={selectedModel} 
              onChange={handleModelChange}
              disabled={loading}
            >
              <option value="">Select Model</option>
              {availableModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        )}
        
        {selectedBrand && selectedModel && (
          <div className="device-info">
            <div className="device-info-item">
              <span className="device-info-label">Selected Brand:</span>
              <span className="device-info-value">{selectedBrand}</span>
            </div>
            <div className="device-info-item">
              <span className="device-info-label">Selected Model:</span>
              <span className="device-info-value">{selectedModel}</span>
            </div>
          </div>
        )}
      </section>
      
      {loading && <div className="loading">Loading...</div>}
      
      {selectedModel && firmwareVersions.length > 0 && (
        <section className="os-downloads-section">
          <h2>OS Downloads</h2>
          
          <div className="firmware-list">
            {firmwareVersions.map((firmware, index) => (
              <div key={index} className="firmware-item">
                <div className="firmware-info">
                  <span className="firmware-version">Version {firmware.version}</span>
                  <span className="firmware-type">{firmware.firmwareLink ? 'Google Drive' : 'Direct Download'}</span>
                  {firmware.releaseNotes && (
                    <span className="firmware-notes">{firmware.releaseNotes}</span>
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
            ))}
          </div>
        </section>
      )}
      
      <section className="installation-tools-section">
        <h2>Installation Tools</h2>
        
        <div className="toolkit-info">
          <h3>Universal Installation Toolkit</h3>
          <p>Compatible with all CIRO and LESIYA devices. Required for firmware installation.</p>
        </div>
        
        <a href="https://drive.google.com/file/d/1GX8F9jFpPJpcACCyN12AMXU5w-xO5f9Z/view?usp=drive_link" className="toolkit-download-button" target="_blank" rel="noopener noreferrer">Download Toolkit</a>
      </section>
    </div>
  )
}

export default FirmwareManager 