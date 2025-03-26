import React, { useEffect, useState } from 'react';
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

function Reports() {
  const [campaigns, setCampaigns] = useState([]);
  const [dateRange, setDateRange] = useState('last30');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await instance.get('/campaigns'); // Use the axios instance
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="reports">
      <div className="header">
        <h2>Campaign Reports</h2>
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          className="date-range-select"
        >
          <option value="last7">Last 7 days</option>
          <option value="last30">Last 30 days</option>
          <option value="last90">Last 90 days</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      <div className="reports-overview">
        <div className="metric-card">
          <h3>Total Sent</h3>
          <p>{campaigns.reduce((total, campaign) => total + campaign.sent, 0)}</p>
          <span className="trend positive">+12.5%</span>
        </div>
        <div className="metric-card">
          <h3>Open Rate</h3>
          <p>{((campaigns.reduce((total, campaign) => total + campaign.opened, 0) / campaigns.reduce((total, campaign) => total + campaign.sent, 0)) * 100).toFixed(1) || 0}%</p>
          <span className="trend positive">+2.1%</span>
        </div>
        <div className="metric-card">
          <h3>Click Rate</h3>
          <p>{((campaigns.reduce((total, campaign) => total + campaign.clicked, 0) / campaigns.reduce((total, campaign) => total + campaign.opened, 0)) * 100).toFixed(1) || 0}%</p>
          <span className="trend negative">-0.3%</span>
        </div>
        <div className="metric-card">
          <h3>Unsubscribes</h3>
          <p>{0.2}%</p>
          <span className="trend neutral">0%</span>
        </div>
      </div>

      <div className="top-campaigns">
        <h3>Top Performing Campaigns</h3>
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Sent</th>
              <th>Opens</th>
              <th>Clicks</th>
              <th>Conversion</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(campaign => (
              <tr key={campaign._id}>
                <td>{campaign.name}</td>
                <td>{campaign.sent}</td>
                <td>{campaign.opened}</td>
                <td>{campaign.clicked}</td>
                <td>{((campaign.clicked / campaign.sent) * 100).toFixed(1) || 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
