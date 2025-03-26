import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmailMarketing.css';

const instance = axios.create({
  baseURL: 'http://82.180.137.7:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the token in the headers
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get the token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Set the token in the headers
  }
  return config;
});

function Templates({ templates, setTemplates }) {
  const [showForm, setShowForm] = useState(false);
  const [template, setTemplate] = useState({
    name: '',
    content: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch templates from the backend
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await instance.get('/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to fetch templates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Create new template
      const response = await instance.post('/templates', template);
      setTemplates([...templates, response.data]); // Update local state with the new template
      resetForm();
    } catch (error) {
      console.error('Error saving template:', error);
      setError('Failed to save template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTemplate({ name: '', content: '', category: '' });
    setShowForm(false);
  };

  const handleDeleteTemplate = async (id) => {
    setLoading(true);
    setError('');
    try {
      await instance.delete(`/templates/${id}`);
      setTemplates(templates.filter(template => template._id !== id)); // Update local state
    } catch (error) {
      console.error('Error deleting template:', error);
      setError('Failed to delete template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="templates">
      <div className="header">
        <h2>Email Templates</h2>
        <button onClick={() => setShowForm(true)}>Create Template</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}

      {showForm && (
        <form className="template-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Template Name"
            value={template.name}
            onChange={(e) => setTemplate({...template, name: e.target.value})}
            required
          />
          <select
            value={template.category}
            onChange={(e) => setTemplate({...template, category: e.target.value})}
            required
          >
            <option value="">Select Category</option>
            <option value="newsletter">Newsletter</option>
            <option value="promotion">Promotion</option>
            <option value="announcement">Announcement</option>
          </select>
          <textarea
            placeholder="Template Content (HTML)"
            value={template.content}
            onChange={(e) => setTemplate({...template, content: e.target.value})}
            required
          />
          <div className="form-actions">
            <button type="submit">Save Template</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="template-grid">
        {templates.map(template => (
          <div key={template._id} className="template-card">
            <h3>{template.name}</h3>
            <p>Category: {template.category}</p>
            <div className="template-actions">
              <button>Edit</button>
              <button>Preview</button>
              <button className="delete" onClick={() => handleDeleteTemplate(template._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Templates;
