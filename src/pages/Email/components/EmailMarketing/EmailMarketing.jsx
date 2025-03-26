import { useState, useEffect } from 'react';
import './EmailMarketing.css';
import SubscriberList from './SubscriberList';
import CampaignCreator from './CampaignCreator';
import Templates from './Templates';
import Analytics from './Analytics';
import Settings from './Settings/Settings';
import Automation from './Automation';
import Segments from './Segments';
import Reports from './Reports';
import axios from 'axios'; // Import axios directly
import { useNavigate } from 'react-router-dom';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Use the specified URL
  headers: {
    'Content-Type': 'application/json',
  },
});

function EmailMarketing() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const Navigate = useNavigate();

  // Fetch initial data from the backend
  const fetchData = async () => {
    try {
      const [subscribersResponse, campaignsResponse, templatesResponse] = await Promise.all([
        instance.get('/subscribers'),
        instance.get('/campaigns'),
        instance.get('/templates')
      ]);
      setSubscribers(subscribersResponse.data);
      setCampaigns(campaignsResponse.data);
      setTemplates(templatesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubscriber = async (subscriber) => {
    try {
      const response = await instance.post('/subscribers', subscriber);
      setSubscribers([...subscribers, response.data]);
    } catch (error) {
      console.error('Error adding subscriber:', error);
    }
  };

  const handleDeleteSubscriber = async (id) => {
    try {
      await instance.delete(`/subscribers/${id}`);
      setSubscribers(subscribers.filter(sub => sub.id !== id));
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const handleCreateCampaign = async (campaign) => {
    try {
      const response = await instance.post('/campaigns', campaign);
      setCampaigns([...campaigns, response.data]);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const handleSaveCampaign = async (campaign) => {
    try {
      const response = await instance.put(`/campaigns/${campaign.id}`, campaign);
      setCampaigns(campaigns.map(c => (c.id === campaign.id ? response.data : c)));
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const handleDeleteCampaign = async (id) => {
    try {
      await instance.delete(`/campaigns/${id}`);
      setCampaigns(campaigns.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleCreateTemplate = async (template) => {
    try {
      const response = await instance.post('/templates', template);
      setTemplates([...templates, response.data]);
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      await instance.delete(`/templates/${id}`);
      setTemplates(templates.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <div className="email-marketing">
      <nav className="email-marketing-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'subscribers' ? 'active' : ''} 
          onClick={() => setActiveTab('subscribers')}
        >
          Subscribers
        </button>
        <button 
          className={activeTab === 'campaigns' ? 'active' : ''} 
          onClick={() => setActiveTab('campaigns')}
        >
          Campaigns
        </button>
        <button 
          className={activeTab === 'segments' ? 'active' : ''} 
          onClick={() => setActiveTab('segments')}
        >
          Segments
        </button>
        <button 
          className={activeTab === 'templates' ? 'active' : ''} 
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''} 
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''} 
          onClick={() => Navigate('/settings')}
        >
          Settings
        </button>
      </nav>

      <div className="email-marketing-content">
        {activeTab === 'dashboard' && (
          <Analytics campaigns={campaigns} />
        )}
        {activeTab === 'subscribers' && (
          <SubscriberList 
            subscribers={subscribers} 
            setTemplates={setTemplates} // Pass setTemplates as a prop
            onAddSubscriber={handleAddSubscriber}
            onDeleteSubscriber={handleDeleteSubscriber}
          />
        )}
        {activeTab === 'campaigns' && (
          <CampaignCreator 
            campaigns={campaigns}
            setCampaigns={setCampaigns} // Pass setCampaigns as a prop
            subscribers={subscribers}
            templates={templates}
            onCreateCampaign={handleCreateCampaign}
            onSaveCampaign={handleSaveCampaign}
            onDeleteCampaign={handleDeleteCampaign}
          />
        )}
        {activeTab === 'automation' && (
          <Automation />
        )}
        {activeTab === 'templates' && (
          <Templates 
            templates={templates}
            setTemplates={setTemplates} // Pass setTemplates as a prop
            onCreateTemplate={handleCreateTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        )}
        {activeTab === 'reports' && (
          <Reports campaigns={campaigns} />
        )}
        {activeTab === 'settings' && (
          <Settings />
        )}
      </div>
    </div>
  );
}

export default EmailMarketing;
