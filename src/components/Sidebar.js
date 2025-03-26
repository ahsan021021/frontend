import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBolt, faTachometerAlt, faAddressBook, faComments, faCalendarAlt, faCreditCard, faEnvelope, faFileAlt, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [user, setUser] = useState({ firstName: "", lastName: "" });
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the headers
          },
        });

        // Set the user's first name and last name
        setUser({
          firstName: response.data.firstName || "First Name",
          lastName: response.data.lastName || "Last Name",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <h1>Lead Savvy</h1>
        <button className="close-button" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div>
        <div className="profile-container">
          <div className="profile">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIs3peZbmHi0e-uTv4_RB4RWFfqEzE7BNNSg&s"
              alt="Profile"
              width="50"
              height="50"
            />
            <div>
              {/* Display the user's first name and last name */}
              <span>{`${user.firstName} ${user.lastName}`}</span>
            </div>
          </div>
        </div>
        <div className="search-container">
          <div className="search">
            <input type="text" placeholder="Search" />
          </div>
          <div className="flash-icon">
            <FontAwesomeIcon icon={faBolt} />
          </div>
        </div>
        <div className="menu">
          <NavLink to="/dashboard" activeClassName="active">
            <FontAwesomeIcon icon={faTachometerAlt} className="menu-icon" /> Dashboard
          </NavLink>
          <NavLink to="/contact" activeClassName="active">
            <FontAwesomeIcon icon={faAddressBook} className="menu-icon" /> Contact
          </NavLink>
          <NavLink to="/conversation" activeClassName="active">
            <FontAwesomeIcon icon={faComments} className="menu-icon" /> Conversation
          </NavLink>
          <NavLink to="/calendar" activeClassName="active">
            <FontAwesomeIcon icon={faCalendarAlt} className="menu-icon" /> Calendar
          </NavLink>
          <NavLink to="/opportunities" activeClassName="active">
            <FontAwesomeIcon icon={faCreditCard} className="menu-icon" /> Opportunities
          </NavLink>
          <NavLink to="/email" activeClassName="active">
            <FontAwesomeIcon icon={faEnvelope} className="menu-icon" /> Email Marketing
          </NavLink>
          <NavLink to="/scraper" activeClassName="active">
            <FontAwesomeIcon icon={faEnvelope} className="menu-icon" /> Data Scrapper
          </NavLink>
          <NavLink to="http://localhost:8080/" activeClassName="active">
            <FontAwesomeIcon icon={faFileAlt} className="menu-icon" /> Landing Page Builder
          </NavLink>
        </div>
        <hr className="menu-divider" />
      </div>
      <div className="bottom-menu">
        <NavLink to="/settings" activeClassName="active">
          <FontAwesomeIcon icon={faCog} className="menu-icon" /> Settings
        </NavLink>
        <button className="logout-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;