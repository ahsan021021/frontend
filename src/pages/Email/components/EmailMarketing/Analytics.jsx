import './EmailMarketing.css';

function Analytics({ campaigns }) {
  const calculateStats = (campaign) => {
    // Mock statistics - in a real app, these would come from your backend
    return {
      sent: Math.floor(Math.random() * 1000),
      opened: Math.floor(Math.random() * 800),
      clicked: Math.floor(Math.random() * 400),
      bounced: Math.floor(Math.random() * 50)
    };
  };

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
              const stats = calculateStats(campaign);
              const openRate = ((stats.opened / stats.sent) * 100).toFixed(1);
              const clickRate = ((stats.clicked / stats.opened) * 100).toFixed(1);
              
              return (
                <tr key={campaign.id}>
                  <td>{campaign.name}</td>
                  <td>{stats.sent}</td>
                  <td>{stats.opened}</td>
                  <td>{stats.clicked}</td>
                  <td>{stats.bounced}</td>
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