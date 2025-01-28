import { useState } from 'react';
import './EmailMarketing.css';

function Segments({ subscribers }) {
  const [segments, setSegments] = useState([
    { id: 1, name: 'Active Customers', criteria: ['purchased_last_30_days'], count: 150 },
    { id: 2, name: 'Newsletter Subscribers', criteria: ['subscribed_newsletter'], count: 500 }
  ]);

  return (
    <div className="segments">
      <div className="header">
        <h2>Subscriber Segments</h2>
        <button>Create Segment</button>
      </div>

      <div className="segment-grid">
        {segments.map(segment => (
          <div key={segment.id} className="segment-card">
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
              <button>Edit</button>
              <button>Export</button>
              <button className="delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Segments;