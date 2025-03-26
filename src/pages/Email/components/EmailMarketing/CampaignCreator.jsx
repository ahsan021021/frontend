import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select/creatable';
import Modal from './Modal';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
import './EmailMarketing.css';

function CampaignCreator({ campaigns, setCampaigns }) {
  const [showForm, setShowForm] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [csvColumns, setCsvColumns] = useState([]);
  const [selectedEmailColumn, setSelectedEmailColumn] = useState('');
  const [campaign, setCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    template: '',
    recipients: [],
    scheduledDate: ''
  });
  const [templates, setTemplates] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token'); // Get the JWT token from local storage

  // Create axios instance with authorization token
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Fetch campaigns from the backend
  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/campaigns');
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError(error.response?.data?.message || 'Failed to fetch campaigns. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch templates from the backend
  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError(error.response?.data?.message || 'Failed to fetch templates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscribers from the backend
  const fetchSubscribers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/subscribers');
      setSubscribers(response.data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setError(error.response?.data?.message || 'Failed to fetch subscribers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
    fetchSubscribers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!campaign.name || !campaign.subject || !campaign.content || !campaign.template || campaign.recipients.length === 0) {
      setError('Please fill in all required fields and select at least one recipient.');
      setLoading(false);
      return;
    }

    if (new Date(campaign.scheduledDate) < new Date()) {
      setError('Scheduled date cannot be in the past.');
      setLoading(false);
      return;
    }

    try {
      const campaignData = {
        ...campaign,
        recipients: campaign.recipients
          .filter(recipient => recipient !== null && recipient !== undefined)
          .map(recipient => recipient.value || recipient.label)
      };

      if (campaign.id) {
        // Update existing campaign
        await axiosInstance.put(`/campaigns/${campaign.id}`, campaignData);
      } else {
        // Create new campaign
        await axiosInstance.post('/campaigns', campaignData);
      }

      resetForm();
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
      setError('Failed to save campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCampaign({ name: '', subject: '', content: '', template: '', recipients: [], scheduledDate: '' });
    setShowForm(false);
  };

  const handleEditCampaign = (campaign) => {
    setCampaign({
      ...campaign,
      id: campaign._id,
      recipients: campaign.recipients.map(recipient => ({
        value: recipient,
        label: recipient
      }))
    });
    setShowForm(true);
  };

  const handleDeleteCampaign = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this campaign?');
    if (!confirmDelete) return;

    setLoading(true);
    setError('');
    try {
      await axiosInstance.delete(`/campaigns/${id}`);
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setError('Failed to delete campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCampaign = async (id) => {
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post(`/campaigns/${id}/send`);
      alert('Campaign sent successfully!');
    } catch (error) {
      console.error('Error sending campaign:', error);
      setError('Failed to send campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllRecipients = () => {
    setCampaign({
      ...campaign,
      recipients: subscribers.map(subscriber => ({
        value: subscriber.email,
        label: subscriber.email
      }))
    });
  };

  const handleRecipientChange = (selectedOptions) => {
    setCampaign({ ...campaign, recipients: selectedOptions });
  };

  const handleCSVImport = (acceptedFiles) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
        setCsvColumns(Object.keys(results.data[0]));
        setShowCSVModal(false);
        setShowMappingModal(true);
      }
    });
  };

  const handleMappingSubmit = () => {
    const emails = csvData
      .map(row => row[selectedEmailColumn])
      .filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (emails.length === 0) {
      alert('No valid email addresses found in the selected column.');
      return;
    }

    const newRecipients = emails.map(email => ({
      value: email,
      label: email
    }));

    setCampaign({ ...campaign, recipients: [...campaign.recipients, ...newRecipients] });
    setShowMappingModal(false);
  };

  const recipientOptions = subscribers.map(subscriber => ({
    value: subscriber.email,
    label: subscriber.email
  }));

  return (
    <div className="campaign-creator">
      <div className="header">
        <h2>Email Campaigns</h2>
        <button onClick={() => setShowForm(true)}>Create Campaign</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}

      <Modal isOpen={showForm} onClose={resetForm}>
        <form className="campaign-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Campaign Name"
            value={campaign.name}
            onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Email Subject"
            value={campaign.subject}
            onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
            required
          />
          <select
            value={campaign.template}
            onChange={(e) => setCampaign({ ...campaign, template: e.target.value })}
            required
          >
            <option value="">Select Template</option>
            {templates.map(template => (
              <option key={template._id} value={template._id}>{template.name}</option>
            ))}
          </select>
          <textarea
            placeholder="Email Content"
            value={campaign.content}
            onChange={(e) => setCampaign({ ...campaign, content: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            value={campaign.scheduledDate}
            onChange={(e) => setCampaign({ ...campaign, scheduledDate: e.target.value })}
            required
          />
          <div className="recipients-section">
            <label>Select Recipients:</label>
            <button type="button" onClick={handleSelectAllRecipients}>Select All</button>
            <Select
              isMulti
              options={recipientOptions}
              value={campaign.recipients}
              onChange={handleRecipientChange}
              placeholder="Type to search and select recipients..."
              noOptionsMessage={() => 'No subscribers found'}
              isCreatable
            />
            <button type="button" onClick={() => setShowCSVModal(true)}>Import from CSV</button>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Campaign'}
            </button>
            <button type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showCSVModal} onClose={() => setShowCSVModal(false)}>
        <div className="csv-import-modal">
          <h3>Import Recipients from CSV</h3>
          <Dropzone onDrop={handleCSVImport}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag & drop a CSV file here, or click to select a file</p>
              </div>
            )}
          </Dropzone>
          <button onClick={() => setShowCSVModal(false)}>Cancel</button>
        </div>
      </Modal>

      <Modal isOpen={showMappingModal} onClose={() => setShowMappingModal(false)}>
        <div className="mapping-modal">
          <h3>Map Email Column</h3>
          <select onChange={(e) => setSelectedEmailColumn(e.target.value)} value={selectedEmailColumn}>
            <option value="">Select Email Column</option>
            {csvColumns.map(column => (
              <option key={column} value={column}>{column}</option>
            ))}
          </select>
          <button onClick={handleMappingSubmit}>Submit</button>
          <button onClick={() => setShowMappingModal(false)}>Cancel</button>
        </div>
      </Modal>

      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)}>
        <div className="preview-modal">
          <h3>Email Preview</h3>
          <div
            className="email-preview"
            dangerouslySetInnerHTML={{
              __html: templates.find(template => template._id === campaign.template)?.content
                .replace('{{name}}', 'Recipient Name') // Example name
                .replace('{{content}}', campaign.content) // Inject campaign content
            }}
          />
          <button onClick={() => setShowPreview(false)}>Close</button>
        </div>
      </Modal>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Scheduled Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(campaign => (
            <tr key={campaign._id}>
              <td>{campaign.name}</td>
              <td>{campaign.subject}</td>
              <td>{campaign.status}</td>
              <td>{new Date(campaign.scheduledDate).toLocaleString()}</td>
              <td>
                <button className="action-btn" onClick={() => handleEditCampaign(campaign)}>Edit</button>
                <button className="action-btn" onClick={() => handleSendCampaign(campaign._id)}>Send Now</button>
                <button className="action-btn" onClick={() => handleDeleteCampaign(campaign._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CampaignCreator;