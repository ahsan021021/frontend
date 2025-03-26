import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import axios from 'axios';

function MyProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch user profile data on page load
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const profile = response.data;
        if (profile) {
          setFirstName(profile.firstName);
          setLastName(profile.lastName);
          setEmail(profile.email);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchMyProfile();
  }, []);

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirmation password do not match');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/change-password',
        { currentPassword, newPassword, confirmPassword },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        alert('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.response?.data?.message || 'An error occurred while changing the password');
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
          
          <form className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">First Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled
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
                  disabled
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
                disabled
              />
            </div>
          </form>
        </div>
      </div>

      <div className="card p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form className="space-y-4" onSubmit={handlePasswordChange}>
          <div>
            <label className="block mb-1">Current Password</label>
            <input
              type="password"
              className="input"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block mb-1">New Password</label>
            <input
              type="password"
              className="input"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block mb-1">Confirm New Password</label>
            <input
              type="password"
              className="input"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
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