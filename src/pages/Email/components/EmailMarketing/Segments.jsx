import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmailMarketing.css';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
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

function Segments() {
  const [segments, setSegments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentSegment, setCurrentSegment] = useState({ id: '', name: '', criteria: [] });

  // Fetch segments from the backend
  const fetchSegments = async () => {
    try {
      const response = await instance.get('/segments'); // Use the axios instance
      setSegments(response.data);
    } catch (error) {
      console.error('Error fetching segments:', error);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentSegment.id) {
        // Update existing segment
        await instance.put(`/segments/${currentSegment.id}`, currentSegment);
      } else {
        // Create new segment
        await instance.post('/segments', currentSegment);
      }
      resetForm();
      fetchSegments(); // Refresh the segment list after creating or updating
    } catch (error) {
      console.error('Error saving segment:', error);
    }
  };

  const resetForm = () => {
    setCurrentSegment({ id: '', name: '', criteria: [] });
    setShowForm(false);
  };

  const handleEditSegment = (segment) => {
    setCurrentSegment(segment);
    setShowForm(true);
  };

  const handleDeleteSegment = async (id) => {
    try {
      await instance.delete(`/segments/${id}`); // Use the axios instance
      fetchSegments(); // Refresh the segment list after deletion
    } catch (error) {
      console.error('Error deleting segment:', error);
    }
  };

  const handleExportSegments = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + segments.map(segment => `${segment.name},${segment.count}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "segments.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="segments">
      <div className="header">
        <h2>Subscriber Segments</h2>
        <button onClick={() => setShowForm(true)}>Create Segment</button>
        <button onClick={handleExportSegments}>Export Segments</button>
      </div>

      {showForm && (
        <form className="segment-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Segment Name"
            value={currentSegment.name}
            onChange={(e) => setCurrentSegment({ ...currentSegment, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Criteria (comma separated)"
            value={currentSegment.criteria.join(', ')}
            onChange={(e) => setCurrentSegment({ ...currentSegment, criteria: e.target.value.split(',').map(criterion => criterion.trim()) })}
            required
          />
          <div className="form-actions">
            <button type="submit">Save Segment</button>
            <button type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="segment-grid">
        {segments.map(segment => (
          <div key={segment._id} className="segment-card">
            <h3>{segment.name}</h3>
            <div className="segment-stats">
              <div className="stat">
                <span>Subscribers</span>
                <strong>{segment.count}</strong>
              </div>
              <div className="stat">
                <span>Growth</span>
                <strong>+{Math.floor(Math.random() * 20)}%</strong> {/* Placeholder for growth calculation */}
              </div>
            </div>
            <div className="segment-criteria">
              <h4>Criteria</h4>
              <ul>
                {segment.criteria.map((criterion, index) => (
                  <li key={index}>{criterion.replace(/_/g, ' ')}</li>
                ))}
              </ul>
            </div>
            <div className="segment-actions">
              <button onClick={() => handleEditSegment(segment)}>Edit</button>
              <button className="delete" onClick={() => handleDeleteSegment(segment._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Segments;
