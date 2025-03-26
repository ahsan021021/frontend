import React from 'react';
import Sidebar from '../../components/Sidebar'; // Adjust the path to your Sidebar component
import './Conversation.css'; // Ensure you have a CSS file for styling
import comingSoonImage from '../../assets/coming-soon-vector.svg'; // Add a vector image in your assets folder

const Conversation = () => {
  return (
    <div className="conversation-page">
      <Sidebar /> {/* Sidebar remains visible */}
      <div className="coming-soon-main">
        <img
          src={comingSoonImage}
          alt="Coming Soon"
          className="coming-soon-image"
        />
        <h1 className="coming-soon-title">This Feature is Coming Soon!</h1>
        <p className="coming-soon-description">
          We're working hard to bring this feature to you. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};

export default Conversation;