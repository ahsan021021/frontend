import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import axios from 'axios';

function BusinessProfile() {
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');

  // Fetch business profile data on page load
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/business-profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include the token in the request
        });
        const profile = response.data;
        if (profile) {
          setBusinessName(profile.businessName);
          setBusinessEmail(profile.businessEmail);
          setBusinessPhone(profile.businessPhone);
          setBusinessAddress(profile.businessAddress);
        }
      } catch (error) {
        console.error('Error fetching business profile:', error);
      }
    };

    fetchBusinessProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const profileData = {
      businessName,
      businessEmail,
      businessPhone,
      businessAddress,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/business-profile', profileData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` // Include the token in the request
        },
      });

      if (response.status === 200) {
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Business Profile Settings</h2>
      <div className="card p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">General Information</h3>

        {/* Business Details Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1">Business Name</label>
            <input
              type="text"
              className="input"
              placeholder="Enter business name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Business Email</label>
            <input
              type="email"
              className="input"
              placeholder="Enter business email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Business Phone</label>
            <input
              type="tel"
              className="input"
              placeholder="Enter business phone"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Business Address</label>
            <textarea
              className="input"
              rows="3"
              placeholder="Enter business address"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default BusinessProfile;
