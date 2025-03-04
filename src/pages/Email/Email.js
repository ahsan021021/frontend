import { useState, useEffect } from 'react';
import axios from '../../utils/axios'; 
import Sidebar from '../../components/Sidebar';
import EmailMarketing from './components/EmailMarketing/EmailMarketing';

function Email() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Set the authorization token in axios headers
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return ( 
    <div className="app">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${isSidebarOpen ? 'content-with-sidebar' : ''}`}>
        <EmailMarketing />
      </div>
    </div>
  );
}

export default Email;
