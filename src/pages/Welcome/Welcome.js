import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Welcome.css'
const WelcomePage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      await axios.put(
        'http://82.180.137.7:5000/api/users/profile',
        { firstName, lastName, purpose },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );

      // Redirect to the dashboard or home page after successful update
      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred while updating your profile. Please try again.');
    }
  };

  return (
    <div className="welcome-page">
      <h1>Welcome to the CRM</h1>
      <p>Please complete your profile to get started.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="purpose">Purpose</label>
          <input
            type="text"
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="E.g., Manage leads, track sales, etc."
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className='login-button' type="submit">Complete Profile</button>
      </form>
    </div>
  );
};

export default WelcomePage;