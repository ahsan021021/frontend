import { useState } from 'react';
import './EmailMarketing.css';

function Reports({ campaigns }) {
  const [dateRange, setDateRange] = useState('last30');
  
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
          <p>24,892</p>
          <span className="trend positive">+12.5%</span>
        </div>
        <div className="metric-card">
          <h3>Open Rate</h3>
          <p>32.4%</p>
          <span className="trend positive">+2.1%</span>
        </div>
        <div className="metric-card">
          <h3>Click Rate</h3>
          <p>4.8%</p>
          <span className="trend negative">-0.3%</span>
        </div>
        <div className="metric-card">
          <h3>Unsubscribes</h3>
          <p>0.2%</p>
          <span className="trend neutral">0%</span>
        </div>
      </div>

      <div className="report-charts">
        <div className="chart-container">
          <h3>Email Performance Trends</h3>
          <div className="chart-placeholder">
            {/* Chart would go here */}
            <div className="mock-chart"></div>
          </div>
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
              <tr key={campaign.id}>
                <td>{campaign.name}</td>
                <td>{Math.floor(Math.random() * 10000)}</td>
                <td>{Math.floor(Math.random() * 80)}%</td>
                <td>{Math.floor(Math.random() * 40)}%</td>
                <td>{Math.floor(Math.random() * 10)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;