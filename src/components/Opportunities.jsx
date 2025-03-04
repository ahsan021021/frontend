import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import axios from 'axios';

function Opportunities() {
  const [allowDifferentOwners, setAllowDifferentOwners] = useState(false);
  const [autoOpportunityOwnerFollower, setAutoOpportunityOwnerFollower] = useState(true);
  const [autoContactOwnerFollower, setAutoContactOwnerFollower] = useState(true);

  // Fetch opportunities settings on page load
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/opportunities', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include the token in the request
        });
        const settings = response.data;
        if (settings) {
          setAllowDifferentOwners(settings.allowDifferentOwners);
          setAutoOpportunityOwnerFollower(settings.autoOpportunityOwnerFollower);
          setAutoContactOwnerFollower(settings.autoContactOwnerFollower);
        }
      } catch (error) {
        console.error('Error fetching opportunities settings:', error);
      }
    };

    fetchOpportunities();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const opportunitiesData = {
      allowDifferentOwners,
      autoOpportunityOwnerFollower,
      autoContactOwnerFollower,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/opportunities', opportunitiesData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` // Include the token in the request
        },
      });

      if (response.status === 200) {
        alert('Opportunities settings updated successfully');
      } else {
        alert('Failed to update opportunities settings');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating opportunities settings');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Opportunities & Pipelines</h2>
      
      <div className="flex mb-6 border-b border-gray-700">
        <button className="px-4 py-2 tab-active">Opportunities</button>
        <button className="px-4 py-2">Pipelines</button>
      </div>

      <div className="card p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-6">Customize Opportunity Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 border border-gray-700 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">Allow different owners of Contacts and their Opportunities</h4>
                <button className="text-gray-400 hover:text-gray-300">
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-400">
                Enable this setting to allow different team members to own contacts and their associated opportunities
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={allowDifferentOwners}
                onChange={(e) => setAllowDifferentOwners(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-start gap-4 p-4 border border-gray-700 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">Automatically make Opportunity owner a follower of Contact</h4>
                <button className="text-gray-400 hover:text-gray-300">
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-400">
                When a new owner is selected for an opportunity, they will be added as a follower to the contact
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={autoOpportunityOwnerFollower}
                onChange={(e) => setAutoOpportunityOwnerFollower(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-start gap-4 p-4 border border-gray-700 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">Automatically make Contact owner a follower of the Opportunity</h4>
                <button className="text-gray-400 hover:text-gray-300">
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-400">
                When a new owner is selected for a contact, they will be added as a follower to the opportunities
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={autoContactOwnerFollower}
                onChange={(e) => setAutoContactOwnerFollower(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <button type="submit" className="btn-primary" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Opportunities;
