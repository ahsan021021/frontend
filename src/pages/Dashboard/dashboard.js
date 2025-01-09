import React, { useState } from "react";
import "./LeadSavvyDashboard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSearch, faPhone, faBell, faBolt, faBrain, faTachometerAlt, faAddressBook, faComments, faCalendarAlt, faCreditCard, faEnvelope, faFileAlt, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function LeadSavvyDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar">
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
                src="https://storage.googleapis.com/a1aa/image/Hb1tJHs4tyLnI55EPhkGijS5yEknl2xf1asTFIDj3oSjfZDUA.jpg"
                alt="Profile of Kaneer Kerla"
                width="50"
                height="50"
              />
              <div>
                <span>Kaneer Kerla</span>
                <span>Austin, Texas</span>
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
            <a href="#">
              <FontAwesomeIcon icon={faBrain} /> AI Help
            </a>
            <a href="#" className="active">
              <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
            </a>
            <a href="#">
              <FontAwesomeIcon icon={faAddressBook} /> Contact
            </a>
            <a href="#">
              <FontAwesomeIcon icon={faComments} /> Conversation
            </a>
            <a href="#">
              <FontAwesomeIcon icon={faCalendarAlt} /> Calendar
            </a>
            <a href="#">
              <FontAwesomeIcon icon={faCreditCard} /> Payment
            </a>
            <a href="#">
              <FontAwesomeIcon icon={faEnvelope} /> Email Marketing
            </a>
            <a href="http://127.0.0.1:5500/gramateria-master/build/">
              <FontAwesomeIcon icon={faFileAlt} /> Landing Page Builder
            </a>
          </div>
        </div>
        <div className="bottom-menu">
          <a href="#">
            <FontAwesomeIcon icon={faCog} /> Settings
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </a>
        </div>
      </div>
      <div className="main-content">
        <div className="header">
          <button className="toggle-button" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input type="text" placeholder="Search here..." />
          </div>
          <div className="icons">
            <FontAwesomeIcon icon={faPhone} style={{ color: "#00FF00" }} />
            <FontAwesomeIcon icon={faBell} />
            <div className="profile-icon">SA</div>
          </div>
        </div>
        <div className="dashboard">
          <div className="card">
            <h2>Pipeliner CRM dashboard</h2>
            <div className="value">215</div>
          </div>
          <div className="card">
            <h2>Value of Won Opportunities</h2>
            <div className="value">€2.131.192</div>
          </div>
          <div className="card">
            <h2>Leads</h2>
            <div className="value">842</div>
          </div>
          <div className="card">
            <h2>Average Account Health Score</h2>
            <div className="value small">5</div>
          </div>
          <div className="card">
            <h2>Top Rainmakers</h2>
            <div className="top-rainmakers">
              <img
                src="https://storage.googleapis.com/a1aa/image/677blms5TA7KGFyEB8c8Dp0Apktc86dR9TPVw3PPDJxyfsBKA.jpg"
                alt="Anna Cole"
                width="50"
                height="50"
              />
              <div>
                <span>Anna Cole</span>
                <span>€267.287</span>
              </div>
            </div>
            <div className="top-rainmakers">
              <img
                src="https://storage.googleapis.com/a1aa/image/o5gvU7CFbaLcDpTQGfU2Cpbf82QKgybmFCYIuhRvDLUIfzGoA.jpg"
                alt="Susan Anderson"
                width="50"
                height="50"
              />
              <div>
                <span>Susan Anderson</span>
                <span>€250.631</span>
              </div>
            </div>
            <div className="top-rainmakers">
              <img
                src="https://storage.googleapis.com/a1aa/image/wFegfKqp20sEyUscQunNaCLyX3yoEqQaJDeeJIBxpC5r8nNQB.jpg"
                alt="Kyle Daniels"
                width="50"
                height="50"
              />
              <div>
                <span>Kyle Daniels</span>
                <span>€211.450</span>
              </div>
            </div>
          </div>
          <div className="card">
            <h2>Value of Won Opportunities</h2>
            <div className="chart"></div>
          </div>
          <div className="card">
            <h2>Accounts Subscribed</h2>
            <div className="chart"></div>
          </div>
          <div className="card">
            <h2>Accounts by Health Score</h2>
            <div className="chart"></div>
          </div>
          <div className="card">
            <h2>Opportunities</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>QUALIFIED</th>
                  <th>WON</th>
                  <th>VALUE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Anna Cole</td>
                  <td>40</td>
                  <td>23</td>
                  <td>€267.287</td>
                </tr>
                <tr>
                  <td>Kyle Daniels</td>
                  <td>39</td>
                  <td>20</td>
                  <td>€211.450</td>
                </tr>
                <tr>
                  <td>Tyler Bryant</td>
                  <td>35</td>
                  <td>19</td>
                  <td>€143.248</td>
                </tr>
                <tr>
                  <td>Curtis Miller</td>
                  <td>34</td>
                  <td>17</td>
                  <td>€140.595</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card">
            <h2>Leads by Status</h2>
            <div className="chart"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadSavvyDashboard;