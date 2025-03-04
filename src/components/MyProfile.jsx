import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import axios from 'axios';

function MyProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Fetch user profile data on page load
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/my-profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include the token in the request
        });
        const profile = response.data;
        if (profile) {
          setFirstName(profile.firstName);
          setLastName(profile.lastName);
          setEmail(profile.email);
          setPhone(profile.phone);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchMyProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const profileData = {
      firstName,
      lastName,
      email,
      phone,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/my-profile', profileData, {
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
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      
      <div className="card p-6 rounded-lg mb-6">
        <div className="flex items-start gap-8">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>
          </div>
          
          <form className="flex-1 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">First Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-1">Last Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block mb-1">Phone</label>
              <input
                type="tel"
                className="input"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn-primary">
              Update Profile
            </button>
          </form>
        </div>
      </div>

      <div className="card p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form className="space-y-4">
          <div>
            <label className="block mb-1">Current Password</label>
            <input type="password" className="input" placeholder="Enter current password" />
          </div>
          
          <div>
            <label className="block mb-1">New Password</label>
            <input type="password" className="input" placeholder="Enter new password" />
          </div>
          
          <div>
            <label className="block mb-1">Confirm New Password</label>
            <input type="password" className="input" placeholder="Confirm new password" />
          </div>
          
          <button type="submit" className="btn-primary">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default MyProfile;
