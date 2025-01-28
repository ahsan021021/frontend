import { useState } from 'react';
import './EmailMarketing.css';

function Automation({ campaigns }) {
  const [workflows, setWorkflows] = useState([
    { id: 1, name: 'Welcome Series', status: 'active', triggers: ['signup'], steps: 3 },
    { id: 2, name: 'Abandoned Cart', status: 'paused', triggers: ['cart_abandoned'], steps: 4 }
  ]);

  return (
    <div className="automation">
      <div className="header">
        <h2>Email Automation</h2>
        <button>Create Workflow</button>
      </div>

      <div className="workflow-grid">
        {workflows.map(workflow => (
          <div key={workflow.id} className="workflow-card">
            <div className="workflow-header">
              <h3>{workflow.name}</h3>
              <span className={`status ${workflow.status}`}>{workflow.status}</span>
            </div>
            <div className="workflow-details">
              <p>Triggers: {workflow.triggers.join(', ')}</p>
              <p>Steps: {workflow.steps}</p>
            </div>
            <div className="workflow-metrics">
              <div className="metric">
                <span>Contacts</span>
                <strong>{Math.floor(Math.random() * 1000)}</strong>
              </div>
              <div className="metric">
                <span>Completed</span>
                <strong>{Math.floor(Math.random() * 500)}</strong>
              </div>
            </div>
            <div className="workflow-actions">
              <button>Edit</button>
              <button>Duplicate</button>
              <button className="delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Automation;