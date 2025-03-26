import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmailMarketing.css';

const instance = axios.create({
  baseURL: 'http://82.180.137.7:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function Segments() {
  const [segments, setSegments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentSegment, setCurrentSegment] = useState({ id: '', name: '', criteria: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const segmentsPerPage = 5;

  const fetchSegments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await instance.get('/segments');
      setSegments(response.data);
    } catch (error) {
      console.error('Error fetching segments:', error);
      setError('Failed to fetch segments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!currentSegment.name.trim()) {
      setError('Segment name is required.');
      setLoading(false);
      return;
    }
    if (currentSegment.criteria.length === 0 || currentSegment.criteria.some((criterion) => !criterion.trim())) {
      setError('At least one valid criterion is required.');
      setLoading(false);
      return;
    }

    try {
      if (currentSegment.id) {
        await instance.put(`/segments/${currentSegment.id}`, currentSegment);
      } else {
        await instance.post('/segments', currentSegment);
      }
      resetForm();
      fetchSegments();
    } catch (error) {
      console.error('Error saving segment:', error);
      setError('Failed to save segment. Please try again.');
    } finally {
      setLoading(false);
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
    setLoading(true);
    setError('');
    try {
      await instance.delete(`/segments/${id}`);
      fetchSegments();
    } catch (error) {
      console.error('Error deleting segment:', error);
      setError('Failed to delete segment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportSegments = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Name,Subscribers\n' +
      segments.map((segment) => `${segment.name},${segment.count}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'segments.csv');
    document.body.appendChild(link);
    link.click();
  };

  const handlePreviewSubscribers = async (segmentId) => {
    setLoading(true);
    setError('');
    try {
      const response = await instance.get(`/segments/${segmentId}/subscribers`);
      alert(`Subscribers in this segment:\n${response.data.join('\n')}`);
    } catch (error) {
      console.error('Error fetching subscribers for segment:', error);
      setError('Failed to fetch subscribers for this segment.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSegments = segments.filter((segment) =>
    segment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastSegment = currentPage * segmentsPerPage;
  const indexOfFirstSegment = indexOfLastSegment - segmentsPerPage;
  const currentSegments = filteredSegments.slice(indexOfFirstSegment, indexOfLastSegment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="segments">
      <div className="header">
        <h2>Subscriber Segments</h2>
        <input
          type="text"
          placeholder="Search segments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => setShowForm(true)}>Create Segment</button>
        <button onClick={handleExportSegments}>Export Segments</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}

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
            onChange={(e) =>
              setCurrentSegment({
                ...currentSegment,
                criteria: e.target.value.split(',').map((criterion) => criterion.trim()),
              })
            }
            required
          />
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Segment'}
            </button>
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="segment-grid">
        {currentSegments.map((segment) => (
          <div key={segment._id} className="segment-card">
            <h3>{segment.name}</h3>
            <div className="segment-stats">
              <div className="stat">
                <span>Subscribers</span>
                <strong>{segment.count}</strong>
              </div>
              <div className="stat">
                <span>Growth</span>
                <strong>+{Math.floor(Math.random() * 20)}%</strong>
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
              <button onClick={() => handlePreviewSubscribers(segment._id)}>Preview Subscribers</button>
              <button className="delete" onClick={() => handleDeleteSegment(segment._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredSegments.length / segmentsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Segments;