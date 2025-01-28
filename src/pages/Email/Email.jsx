import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import EmailMarketing from './components/EmailMarketing/EmailMarketing';

function Email() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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