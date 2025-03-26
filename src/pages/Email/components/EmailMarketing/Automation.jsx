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

function Automation() {
  const [workflows, setWorkflows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState({ id: '', name: '', status: 'active', triggers: [], steps: 0 });

  // Fetch workflows from the backend
  const fetchWorkflows = async () => {
    try {
      const response = await instance.get('/automations'); // Use the axios instance
      setWorkflows(response.data);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentWorkflow.id) {
        // Update existing workflow
        await instance.put(`/automations/${currentWorkflow.id}`, currentWorkflow);
      } else {
        // Create new workflow
        await instance.post('/automations', currentWorkflow);
      }
      resetForm();
      fetchWorkflows(); // Refresh the workflow list after creating or updating
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  const resetForm = () => {
    setCurrentWorkflow({ id: '', name: '', status: 'active', triggers: [], steps: 0 });
    setShowForm(false);
  };

  const handleEditWorkflow = (workflow) => {
    setCurrentWorkflow(workflow);
    setShowForm(true);
  };

  const handleDeleteWorkflow = async (id) => {
    try {
      await instance.delete(`/automations/${id}`); // Use the axios instance
      fetchWorkflows(); // Refresh the workflow list after deletion
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };

  return (
    <div className="automation">
      <div className="header">
        <h2>Email Automation</h2>
        <button onClick={() => setShowForm(true)}>Create Workflow</button>
      </div>

      {showForm && (
        <form className="workflow-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Workflow Name"
            value={currentWorkflow.name}
            onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, name: e.target.value })}
            required
          />
          <select
            value={currentWorkflow.status}
            onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
          <input
            type="text"
            placeholder="Triggers (comma separated)"
            value={currentWorkflow.triggers.join(', ')}
            onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, triggers: e.target.value.split(',').map(trigger => trigger.trim()) })}
            required
          />
          <input
            type="number"
            placeholder="Number of Steps"
            value={currentWorkflow.steps}
            onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, steps: Number(e.target.value) })}
            required
          />
          <div className="form-actions">
            <button type="submit">Save Workflow</button>
            <button type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="workflow-grid">
        {workflows.map(workflow => (
          <div key={workflow._id} className="workflow-card">
            <div className="workflow-header">
              <h3>{workflow.name}</h3>
              <span className={`status ${workflow.status}`}>{workflow.status}</span>
            </div>
            <div className="workflow-details">
              <p>Triggers: {workflow.triggers.join(', ')}</p>
              <p>Steps: {workflow.steps}</p>
            </div>
            <div className="workflow-actions">
              <button onClick={() => handleEditWorkflow(workflow)}>Edit</button>
              <button className="delete" onClick={() => handleDeleteWorkflow(workflow._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Automation;
