import { useState } from 'react';
import { Menu, ArrowLeft } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Contacts from './pages/Contacts';
import SmartLists from './pages/SmartLists';
import BulkActions from './pages/BulkActions';
import Restore from './pages/Restore';
import Tasks from './pages/Tasks';
import Companies from './pages/Companies';
import ManageSmartLists from './pages/ManageSmartLists';
import './Contact.css';

function Contact() {
  const [currentPage, setCurrentPage] = useState('contacts');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'contacts', label: 'Contacts' },
    { id: 'smartLists', label: 'Smart Lists' },
    { id: 'bulkActions', label: 'Bulk Actions' },
    { id: 'restore', label: 'Restore' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'companies', label: 'Companies' },
    { id: 'manageSmartLists', label: 'Manage Smart Lists' },
  ];

  const renderPage = () => {
    switch(currentPage) {
      case 'contacts':
        return <Contacts />;
      case 'smartLists':
        return <SmartLists />;
      case 'bulkActions':
        return <BulkActions />;
      case 'restore':
        return <Restore />;
      case 'tasks':
        return <Tasks />;
      case 'companies':
        return <Companies />;
      case 'manageSmartLists':
        return <ManageSmartLists />;
      default:
        return <Contacts />;
    }
  };

  return (
    <div className={`container ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isSidebarOpen={isMobileMenuOpen} toggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="main-content">
        <nav className="top-nav">
          <button className="toggle-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6 text-white" />
          </button>
          <div className="nav-items">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button className="settings-btn">⚙️</button>
        </nav>
        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default Contact;