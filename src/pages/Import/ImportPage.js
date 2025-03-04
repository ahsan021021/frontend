import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios'; // Import Axios instance with token
import Sidebar from '../../components/Sidebar';
import './ImportPage.css';

const ImportPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${isSidebarOpen ? 'content-with-sidebar' : ''}`}>
        <h1>Import Page</h1>
        {/* Add your import page content here */}
      </div>
    </div>
  );
};

export default ImportPage;
