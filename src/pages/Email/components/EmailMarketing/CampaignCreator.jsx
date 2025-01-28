import { useState } from 'react';
import './EmailMarketing.css';

function CampaignCreator({ campaigns, subscribers, templates, onCreateCampaign, onSaveCampaign }) {
  const [showForm, setShowForm] = useState(false);
  const [campaign, setCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    template: '',
    recipients: [],
    scheduledDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (campaign.id) {
      onSaveCampaign(campaign);
    } else {
      onCreateCampaign(campaign);
    }
    setCampaign({ name: '', subject: '', content: '', template: '', recipients: [], scheduledDate: '' });
    setShowForm(false);
  };

  return (
    <div className="campaign-creator">
      <div className="header">
        <h2>Email Campaigns</h2>
        <button onClick={() => setShowForm(true)}>Create Campaign</button>
      </div>

      {showForm && (
        <form className="campaign-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Campaign Name"
            value={campaign.name}
            onChange={(e) => setCampaign({...campaign, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Email Subject"
            value={campaign.subject}
            onChange={(e) => setCampaign({...campaign, subject: e.target.value})}
            required
          />
          <select
            value={campaign.template}
            onChange={(e) => setCampaign({...campaign, template: e.target.value})}
            required
          >
            <option value="">Select Template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </select>
          <textarea
            placeholder="Email Content"
            value={campaign.content}
            onChange={(e) => setCampaign({...campaign, content: e.target.value})}
            required
          />
          <input
            type="datetime-local"
            value={campaign.scheduledDate}
            onChange={(e) => setCampaign({...campaign, scheduledDate: e.target.value})}
            required
          />
          <div className="form-actions">
            <button type="submit">Save Campaign</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

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
            <tr key={campaign.id}>
              <td>{campaign.name}</td>
              <td>{campaign.subject}</td>
              <td>{campaign.status}</td>
              <td>{new Date(campaign.scheduledDate).toLocaleString()}</td>
              <td>
                <button className="action-btn">Edit</button>
                <button className="action-btn">Send Now</button>
                <button className="action-btn delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CampaignCreator;