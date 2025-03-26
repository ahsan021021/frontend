import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BulkActions() {
  const [importHistory, setImportHistory] = useState([]);

  useEffect(() => {
    const fetchImportHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/import/history',
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to headers
            },
          }
        );
        setImportHistory(response.data);
      } catch (error) {
        console.error('Error fetching import history:', error);
      }
    };

    fetchImportHistory();
  }, []);

  return (
    <div className="page-content">
      <div className="bulk-actions-header">
        <h2>Import History</h2>
      </div>
      <div className="bulk-actions-table">
        <div className="table-header">
          <span>Type</span>
          <span>Timestamp</span>
          <span>Count</span>
        </div>
        {importHistory.map((entry) => (
          <div key={entry._id} className="table-row">
            <span>{entry.type}</span>
            <span>{new Date(entry.timestamp).toLocaleString()}</span>
            <span>{entry.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BulkActions;