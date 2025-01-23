import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Opportunities from '../../components/Opportunities';
import Pipelines from '../../components/Pipelines';
import BulkActions from '../../components/BulkActions';
import { PipelineProvider } from '../../context/PipelineContext';
import Sidebar from '../../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './OpportunitiesPage.css';

function OpportunitiesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <PipelineProvider>
      <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="main-content">
          <nav className="nav">
            <div className="nav-content">
              <button className="toggle-button" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} />
              </button>
              <h1 className="nav-title">Opportunities</h1>
              <div className="nav-links">
                <NavLink to="/opportunities" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Opportunities
                </NavLink>
                <NavLink to="/opportunities/pipelines" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Pipelines
                </NavLink>
                <NavLink to="/opportunities/bulk-actions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Bulk Actions
                </NavLink>
              </div>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Opportunities />} />
              <Route path="pipelines" element={<Pipelines />} />
              <Route path="bulk-actions" element={<BulkActions />} />
            </Routes>
          </main>
        </div>
      </div>
    </PipelineProvider>
  );
}

export default OpportunitiesPage;