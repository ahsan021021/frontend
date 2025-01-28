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

function EmailMarketing() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    // Mock data initialization
    const mockSubscribers = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      email: `user${i + 1}@example.com`,
      name: `User ${i + 1}`,
      status: Math.random() > 0.2 ? 'active' : 'inactive',
      tags: ['newsletter'],
      lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
    setSubscribers(mockSubscribers);

    const mockCampaigns = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Campaign ${i + 1}`,
      subject: `Subject for Campaign ${i + 1}`,
      status: ['active', 'draft', 'completed'][Math.floor(Math.random() * 3)],
      type: ['automated', 'regular'][Math.floor(Math.random() * 2)],
      engagement: Math.floor(Math.random() * 100),
      scheduledDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
    setCampaigns(mockCampaigns);

    const mockTemplates = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      name: `Template ${i + 1}`,
      category: ['newsletter', 'promotion', 'announcement'][i % 3],
      content: '<h1>Sample Template</h1><p>This is a sample template content.</p>'
    }));
    setTemplates(mockTemplates);
  }, []);

  const handleAddSubscriber = (subscriber) => {
    const newSubscriber = {
      ...subscriber,
      id: subscribers.length + 1,
      tags: ['new'],
      lastActive: new Date().toISOString().split('T')[0]
    };
    setSubscribers([...subscribers, newSubscriber]);
  };

  const handleDeleteSubscriber = (id) => {
    setSubscribers(subscribers.filter(sub => sub.id !== id));
  };

  const handleCreateCampaign = (campaign) => {
    const newCampaign = {
      ...campaign,
      id: campaigns.length + 1,
      status: 'draft',
      engagement: 0
    };
    setCampaigns([...campaigns, newCampaign]);
  };

  const handleSaveCampaign = (campaign) => {
    setCampaigns(campaigns.map(c => c.id === campaign.id ? campaign : c));
  };

  const handleDeleteCampaign = (id) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  const handleCreateTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: templates.length + 1
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleDeleteTemplate = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
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
          className={activeTab === 'automation' ? 'active' : ''} 
          onClick={() => setActiveTab('automation')}
        >
          Automation
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
          onClick={() => setActiveTab('settings')}
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
            onAddSubscriber={handleAddSubscriber}
            onDeleteSubscriber={handleDeleteSubscriber}
          />
        )}
        {activeTab === 'campaigns' && (
          <CampaignCreator 
            campaigns={campaigns}
            subscribers={subscribers}
            templates={templates}
            onCreateCampaign={handleCreateCampaign}
            onSaveCampaign={handleSaveCampaign}
            onDeleteCampaign={handleDeleteCampaign}
          />
        )}
        {activeTab === 'automation' && (
          <Automation campaigns={campaigns} />
        )}
        {activeTab === 'segments' && (
          <Segments subscribers={subscribers} />
        )}
        {activeTab === 'templates' && (
          <Templates 
            templates={templates}
            setTemplates={setTemplates}
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