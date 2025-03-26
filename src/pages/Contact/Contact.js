import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios'; // Import Axios instance with token
import { Menu } from 'lucide-react';
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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [tasks, setTasks] = useState([]);

  const menuItems = [
    { id: 'contacts', label: 'Contacts' },
    { id: 'bulkActions', label: 'Bulk Actions' },
    { id: 'restore', label: 'Restore' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'companies', label: 'Companies' },
  ];

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/contacts');
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await axios.get('/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchContacts();
    fetchCompanies();
    fetchTasks();
  }, []);

  const renderPage = () => {
    switch(currentPage) {
      case 'contacts':
        return <Contacts contacts={contacts} onButtonClick={handleButtonClick} />;
      case 'bulkActions':
        return <BulkActions />;
      case 'restore':
        return <Restore />;
      case 'tasks':
        return <Tasks tasks={tasks} />;
      case 'companies':
        return <Companies companies={companies} />;
      default:
        return <Contacts contacts={contacts} />;
    }
  };

  const handleButtonClick = (content) => {
    setPopupContent(content);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupContent(null);
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
      {isPopupOpen && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup" onClick={closePopup}>✖</button>
            {popupContent}
          </div>
        </div>
      )}
    </div>
  );
}

export default Contact;