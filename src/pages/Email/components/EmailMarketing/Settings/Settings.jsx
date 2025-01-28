import { useState } from 'react';
import '../EmailMarketing.css';

function Settings() {
  const [settings, setSettings] = useState({
    companyName: 'My Company',
    emailFromName: 'Marketing Team',
    emailFromAddress: 'marketing@company.com',
    replyToAddress: 'support@company.com',
    emailFooter: 'Default footer text',
    unsubscribeMessage: 'Click here to unsubscribe',
    trackOpens: true,
    trackClicks: true,
    doubleOptIn: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="settings">
      <div className="header">
        <h2>Email Settings</h2>
        <button type="submit">Save Changes</button>
      </div>

      <div className="settings-grid">
        <div className="settings-section">
          <h3>General Settings</h3>
          <div className="setting-field">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
            />
          </div>
          <div className="setting-field">
            <label>From Name</label>
            <input
              type="text"
              name="emailFromName"
              value={settings.emailFromName}
              onChange={handleChange}
            />
          </div>
          <div className="setting-field">
            <label>From Email Address</label>
            <input
              type="email"
              name="emailFromAddress"
              value={settings.emailFromAddress}
              onChange={handleChange}
            />
          </div>
          <div className="setting-field">
            <label>Reply-To Address</label>
            <input
              type="email"
              name="replyToAddress"
              value={settings.replyToAddress}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Email Settings</h3>
          <div className="setting-field">
            <label>Default Footer Text</label>
            <textarea
              name="emailFooter"
              value={settings.emailFooter}
              onChange={handleChange}
            />
          </div>
          <div className="setting-field">
            <label>Unsubscribe Message</label>
            <textarea
              name="unsubscribeMessage"
              value={settings.unsubscribeMessage}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Tracking & Privacy</h3>
          <div className="setting-field checkbox">
            <label>
              <input
                type="checkbox"
                name="trackOpens"
                checked={settings.trackOpens}
                onChange={handleChange}
              />
              Track Email Opens
            </label>
          </div>
          <div className="setting-field checkbox">
            <label>
              <input
                type="checkbox"
                name="trackClicks"
                checked={settings.trackClicks}
                onChange={handleChange}
              />
              Track Link Clicks
            </label>
          </div>
          <div className="setting-field checkbox">
            <label>
              <input
                type="checkbox"
                name="doubleOptIn"
                checked={settings.doubleOptIn}
                onChange={handleChange}
              />
              Require Double Opt-in
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;