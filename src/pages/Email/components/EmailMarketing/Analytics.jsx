import React, { useEffect, useState } from 'react';
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

function Analytics() {
  const [campaigns, setCampaigns] = useState([]);

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
    <div className="analytics">
      <h2>Campaign Analytics</h2>
      
      <div className="analytics-overview">
        <div className="stat-card">
          <h3>Total Campaigns</h3>
          <p>{campaigns.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Campaigns</h3>
          <p>{campaigns.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Campaigns</h3>
          <p>{campaigns.filter(c => c.status === 'completed').length}</p>
        </div>
      </div>

      <div className="campaign-stats">
        <h3>Campaign Performance</h3>
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Sent</th>
              <th>Opened</th>
              <th>Clicked</th>
              <th>Bounced</th>
              <th>Open Rate</th>
              <th>Click Rate</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(campaign => {
              const openRate = ((campaign.opened / campaign.sent) * 100).toFixed(1) || 0;
              const clickRate = ((campaign.clicked / campaign.opened) * 100).toFixed(1) || 0;
              
              return (
                <tr key={campaign._id}>
                  <td>{campaign.name}</td>
                  <td>{campaign.sent}</td>
                  <td>{campaign.opened}</td>
                  <td>{campaign.clicked}</td>
                  <td>{campaign.bounced}</td>
                  <td>{openRate}%</td>
                  <td>{clickRate}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Analytics;
