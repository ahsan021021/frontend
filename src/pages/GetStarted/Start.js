import React from "react";
import { useNavigate } from 'react-router-dom';
import "./start.css"; 

const RightSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup'); // Replace with your target page route
  };

  return (
    <div className="container">
      {/* Right Section */}
      <div className="rights">
        <div className="red-side"></div>
        <div className="title">
          Lead Savvy <span style={{ color: "#fff" }}>AI</span>
        </div>
        <div className="subtitle">All in one! Helping businesses strive</div>
        <div className="image-container">
          {/* Your image and other content */}
        </div>
        <div className="social-icons">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://www.behance.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-behance"></i>
          </a>
        </div>
        {/* Get Started Button */}
        <div className="button-container">
          <button className="get-started-button" onClick={handleGetStarted}>
            GET STARTED
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSection;