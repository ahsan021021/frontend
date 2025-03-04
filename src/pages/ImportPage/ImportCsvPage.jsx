import { useState, useCallback, useEffect } from 'react';
import axios from '../../utils/axios'; // Import Axios instance with token
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/Sidebar';
import Papa from 'papaparse';
import './ImportCsvPage.css';

const REQUIRED_CONTACT_FIELDS = ['name', 'company', 'email', 'phone'];
const REQUIRED_OPPORTUNITY_FIELDS = ['contactId', 'opportunityName', 'pipeline'];

function ImportCsvPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedObjects, setSelectedObjects] = useState({ contacts: true, opportunities: false });
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [importOption, setImportOption] = useState('create-update');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fieldMappings, setFieldMappings] = useState({});
  const [preferences, setPreferences] = useState({
    createSmartlist: false,
    addToWorkflow: false,
    addTags: false
  });
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Parse CSV file
      Papa.parse(file, {
        complete: (results) => {
          setParsedData(results.data);
          // Initialize field mappings with the headers from the first row
          if (results.data && results.data.length > 0) {
            const initialMappings = {};
            // Get headers from the first row's keys
            const headers = Object.keys(results.data[0]);
            headers.forEach(header => {
              initialMappings[header] = '';
            });
            setFieldMappings(initialMappings);
          }
        },
        header: true, // This tells PapaParse to parse the first row as headers
        skipEmptyLines: true
      });

      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 20;
        });
      }, 200);
    }
  };

  const handleObjectSelect = (object) => {
    setSelectedObjects(prev => ({
      ...prev,
      [object]: !prev[object]
    }));
  };

  const handleFieldMapping = (csvField, appField) => {
    setFieldMappings(prev => ({
      ...prev,
      [csvField]: appField
    }));
  };

  const validateMappings = useCallback(() => {
    const errors = [];
    
    if (selectedObjects.contacts) {
      REQUIRED_CONTACT_FIELDS.forEach(field => {
        if (!Object.values(fieldMappings).includes(field)) {
          errors.push(`Required contact field "${field}" is not mapped`);
        }
      });
    }

    if (selectedObjects.opportunities) {
      REQUIRED_OPPORTUNITY_FIELDS.forEach(field => {
        if (!Object.values(fieldMappings).includes(field)) {
          errors.push(`Required opportunity field "${field}" is not mapped`);
        }
      });
    }

    return errors;
  }, [fieldMappings, selectedObjects]);

  // Use useEffect to handle validation errors state update
  useEffect(() => {
    setValidationErrors(validateMappings());
  }, [validateMappings]);

  const handleNext = () => {
    if (currentStep === 3) {
      // Validate mappings before proceeding to final step
      const errors = validateMappings();
      if (errors.length > 0) {
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleStartImport = async () => {
    if (!consentConfirmed) {
      alert('Please confirm consent before starting the import');
      return;
    }

    try {
      // Transform data according to mappings
      const transformedData = parsedData.map(row => {
        const transformed = {};
        Object.entries(fieldMappings).forEach(([csvField, appField]) => {
          if (appField) {
            transformed[appField] = row[csvField];
          }
        });
        return transformed;
      });

      // Log the transformed data for debugging
      console.log('Transformed Data:', transformedData);

      // Send the data to the backend
      if (selectedObjects.contacts) {
        await axios.post('http://localhost:5000/api/import/contacts', transformedData);
      }
      if (selectedObjects.opportunities) {
        await axios.post('http://localhost:5000/api/import/opportunities', transformedData);
      }

      // Simulate import process
      alert('Import started successfully!');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Select objects to start importing</h2>
            <div className="object-selection">
              <div 
                className={`object-card ${selectedObjects.contacts ? 'selected' : ''}`}
                onClick={() => handleObjectSelect('contacts')}
              >
                <div className="object-icon">👥</div>
                <div className="object-info">
                  <h3>Contacts</h3>
                  <p>Contains list of all leads, their details, and specifications.</p>
                </div>
                <div className="checkbox">
                  {selectedObjects.contacts && <span>✓</span>}
                </div>
              </div>

              <div 
                className={`object-card ${selectedObjects.opportunities ? 'selected' : ''}`}
                onClick={() => handleObjectSelect('opportunities')}
              >
                <div className="object-icon">💼</div>
                <div className="object-info">
                  <h3>Opportunities</h3>
                  <p>Contains list of all deals, their stages, statuses and pipeline progress.</p>
                </div>
                <div className="checkbox">
                  {selectedObjects.opportunities && <span>✓</span>}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>Upload your files</h2>
            <p className="upload-info">
              Before uploading files, make sure your file is ready to import.{' '}
              <a href="#" className="link">Download sample file</a> or <a href="#" className="link">learn more</a>.
            </p>

            <div className="upload-area">
              {!selectedFile ? (
                <div className="upload-placeholder" onClick={() => document.getElementById('file-input').click()}>
                  <div className="upload-icon">⬆️</div>
                  <p>Click to upload or drag and drop</p>
                  <p className="file-limit">csv (max size 30MB)</p>
                  <input
                    type="file"
                    id="file-input"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="file-preview">
                  <div className="file-info">
                    <span className="file-icon">📄</span>
                    <div>
                      <p className="file-name">{selectedFile.name}</p>
                      <p className="file-size">{Math.round(selectedFile.size / 1024)}KB - {uploadProgress}% Uploaded</p>
                    </div>
                  </div>
                  <button className="delete-file" onClick={() => setSelectedFile(null)}>🗑️</button>
                </div>
              )}
            </div>

            <div className="import-options">
              <h3>Choose how to import contacts</h3>
              <select 
                value={importOption} 
                onChange={(e) => setImportOption(e.target.value)}
                className="import-select"
              >
                <option value="create-update">Create and update contacts</option>
                <option value="create">Create contacts</option>
                <option value="update">Update contacts</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>Mapping guide</h2>
            <div className="mapping-section">
              <h3>Fields required to</h3>
              <div className="required-fields">
                {selectedObjects.contacts && REQUIRED_CONTACT_FIELDS.map(field => (
                  <div key={field} className="field-item">
                    <span className="field-icon">➤</span>
                    <span>{field}</span>
                  </div>
                ))}
                {selectedObjects.opportunities && REQUIRED_OPPORTUNITY_FIELDS.map(field => (
                  <div key={field} className="field-item">
                    <span className="field-icon">➤</span>
                    <span>{field}</span>
                  </div>
                ))}
              </div>
            </div>

            {validationErrors.length > 0 && (
              <div className="validation-errors">
                {validationErrors.map((error, index) => (
                  <p key={index} className="error-message">{error}</p>
                ))}
              </div>
            )}

            <div className="mapping-table">
              <div className="table-row table-header">
                <div>Column header in file</div>
                <div>Preview information</div>
                <div>Status</div>
                <div>Object</div>
                <div>Fields</div>
                <div>Update empty values</div>
              </div>
              {parsedData && Object.keys(fieldMappings).map((header, index) => (
                <div key={index} className="table-row">
                  <div>{header}</div>
                  <div>{parsedData[0]?.[header] || ''}</div>
                  <div>
                    <span className={`status-badge ${fieldMappings[header] ? 'status-mapped' : 'status-pending'}`}>
                      {fieldMappings[header] ? 'Mapped' : 'Pending'}
                    </span>
                  </div>
                  <div>{selectedObjects.contacts ? 'Contact' : 'Opportunity'}</div>
                  <div>
                    <select
                      className="field-select"
                      value={fieldMappings[header] || ''}
                      onChange={(e) => handleFieldMapping(header, e.target.value)}
                    >
                      <option value="">Please Select</option>
                      {selectedObjects.contacts && REQUIRED_CONTACT_FIELDS.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                      {selectedObjects.opportunities && REQUIRED_OPPORTUNITY_FIELDS.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id={`update-empty-${index}`}
                      defaultChecked={true}
                    />
                    <label htmlFor={`update-empty-${index}`}>Don't update to an empty value</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2>Verify Import</h2>
            <div className="preferences">
              <div className="preference-item">
                <input
                  type="checkbox"
                  id="createSmartlist"
                  checked={preferences.createSmartlist}
                  onChange={(e) => setPreferences(prev => ({ ...prev, createSmartlist: e.target.checked }))}
                />
                <label htmlFor="createSmartlist">Create a Smartlist for new contacts created by the import</label>
              </div>

              <div className="preference-item">
                <input
                  type="checkbox"
                  id="addToWorkflow"
                  checked={preferences.addToWorkflow}
                  onChange={(e) => setPreferences(prev => ({ ...prev, addToWorkflow: e.target.checked }))}
                />
                <label htmlFor="addToWorkflow">Add imported contacts to a workflow</label>
                {preferences.addToWorkflow && (
                  <select
                    value={selectedWorkflow}
                    onChange={(e) => setSelectedWorkflow(e.target.value)}
                    className="import-select"
                  >
                    <option value="">Please select Workflow</option>
                    <option value="workflow1">Workflow 1</option>
                    <option value="workflow2">Workflow 2</option>
                  </select>
                )}
              </div>

              <div className="preference-item">
                <input
                  type="checkbox"
                  id="addTags"
                  checked={preferences.addTags}
                  onChange={(e) => setPreferences(prev => ({ ...prev, addTags: e.target.checked }))}
                />
                <label htmlFor="addTags">Add tags to imported contacts</label>
                {preferences.addTags && (
                  <select
                    value={selectedTags}
                    onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, option => option.value))}
                    className="import-select"
                    multiple
                  >
                    <option value="tag1">Tag 1</option>
                    <option value="tag2">Tag 2</option>
                    <option value="tag3">Tag 3</option>
                  </select>
                )}
              </div>
            </div>

            <div className="consent-section">
              <input
                type="checkbox"
                id="consent"
                checked={consentConfirmed}
                onChange={(e) => setConsentConfirmed(e.target.checked)}
              />
              <label htmlFor="consent">
                I confirm all contacts in this import have consented to hear from us. I've previously contacted them within the last past year, and this list is not from a third party
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${isSidebarOpen ? 'with-sidebar' : ''}`}>
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="import-container">
          <div className="import-header">
            <h1>Imports</h1>
            <p>Import contacts and opportunities</p>
          </div>
          <div className="stepper">
            {[
              { number: 1, label: 'Start', description: 'Select objects and more info' },
              { number: 2, label: 'Upload', description: 'Upload file and configure' },
              { number: 3, label: 'Map', description: 'Map columns to fields' },
              { number: 4, label: 'Verify', description: 'Confirm and finalize selection' }
            ].map(step => (
              <div 
                key={step.number} 
                className={`step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
              >
                <div className="step-number">
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <div className="step-details">
                  <div className="step-label">{step.label}</div>
                  <div className="step-description">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          {renderStepContent()}
          <div className="action-buttons">
            <button 
              className="back-button" 
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </button>
            <div>
              <button className="cancel-button">Cancel</button>
              {currentStep === 4 ? (
                <button 
                  className="next-button"
                  onClick={handleStartImport}
                  disabled={!consentConfirmed}
                >
                  Start Bulk Import
                </button>
              ) : (
                <button 
                  className="next-button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !Object.values(selectedObjects).some(v => v)) ||
                    (currentStep === 2 && !selectedFile) ||
                    (currentStep === 3 && validationErrors.length > 0)
                  }
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportCsvPage;