import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import axios from 'axios';

function EmailSettings() {
  const [smtpServer, setSmtpServer] = useState('');
  const [port, setPort] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [fromName, setFromName] = useState('');
  const [security, setSecurity] = useState('tls');

  // Fetch current email settings when the page loads
  useEffect(() => {
    const fetchEmailSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/email-settings', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          const settings = response.data;
          setSmtpServer(settings.smtpServer || '');
          setPort(settings.port || '');
          setFromEmail(settings.fromEmail || '');
          setEmailPassword(settings.emailPassword || '');
          setFromName(settings.fromName || '');
          setSecurity(settings.security || 'tls');
        }
      } catch (error) {
        console.error('Error fetching email settings:', error);
        alert('Failed to fetch email settings. Please try again.');
      }
    };

    fetchEmailSettings();
  }, []);

  // Handle form submission to update email settings
  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailSettingsData = {
      smtpServer,
      port,
      fromEmail,
      emailPassword,
      fromName,
      security,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/email-settings', emailSettingsData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert('Email settings updated successfully');
      } else {
        alert('Failed to update email settings');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating email settings');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Email Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Email Configuration</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">SMTP Server</label>
              <input
                type="text"
                className="input"
                placeholder="smtp.example.com"
                value={smtpServer}
                onChange={(e) => setSmtpServer(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Port</label>
                <input
                  type="number"
                  className="input"
                  placeholder="587"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Security</label>
                <select
                  className="input"
                  value={security}
                  onChange={(e) => setSecurity(e.target.value)}
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold">Sender Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">From Name</label>
              <input
                type="text"
                className="input"
                placeholder="Your Company Name"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">From Email</label>
              <input
                type="email"
                className="input"
                placeholder="noreply@example.com"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Password</label>
              <input
                type="password"
                className="input"
                placeholder="Your Email Password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EmailSettings;