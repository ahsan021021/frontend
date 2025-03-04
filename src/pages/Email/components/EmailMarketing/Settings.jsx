import { useState, useEffect } from 'react';
import axios from 'axios';
import './EmailMarketing.css';

function Settings() {
  const [settings, setSettings] = useState({
    companyName: '',
    emailFromName: '',
    emailFromAddress: '',
    replyToAddress: '',
    emailFooter: '',
    unsubscribeMessage: '',
    trackOpens: true,
    trackClicks: true,
    doubleOptIn: true,
    smtpHost: '',
    smtpPort: '',
    smtpUser:  '',
    smtpPass: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/settings'); // Adjust the URL as needed
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/settings', settings); // Adjust the URL as needed
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="settings">
      <div className="header">
        <h2>Email Settings</h2>
        <button type="submit" onClick={handleSubmit}>Save Changes</button>
      </div>

      <form onSubmit={handleSubmit}>
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

          <div className="settings-section">
            <h3>SMTP Settings</h3>
            <div className="setting-field">
              <label>SMTP Host</label>
              <input
                type="text"
                name="smtpHost"
                value={settings.smtpHost}
                onChange={handleChange}
                required
              />
            </div>
            <div className="setting-field">
              <label>SMTP Port</label>
              <input
                type="number"
                name="smtpPort"
                value={settings.smtpPort}
                onChange={handleChange}
                required
              />
            </div>
            <div className="setting-field">
              <label>SMTP User</label>
              <input
                type="text"
                name="smtpUser "
                value={settings.smtpUser }
                onChange={handleChange}
                required
              />
            </div>
            <div className="setting-field">
              <label>SMTP Password</label>
              <input
                type="password"
                name="smtpPass"
                value={settings.smtpPass}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Settings;