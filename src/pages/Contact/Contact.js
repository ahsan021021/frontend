import React, { useState } from 'react';
import { Settings, Users, CreditCard, Briefcase, Menu, ArrowLeft, Bell, Globe, Shield, Mail, Palette } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Contacts from '../../components/Contacts';
import SmartLists from '../../components/SmartLists';
import BulkActions from '../../components/BulkActions';
import Restore from '../../components/Restore';
import Tasks from '../../components/Tasks';
import Companies from '../../components/Companies';
import ManageSmartLists from '../../components/ManageSmartLists';
import './Contact.css';

function ContactsPage() {
  const [currentPage, setCurrentPage] = useState('contacts');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'smartLists', label: 'Smart Lists', icon: Briefcase },
    { id: 'bulkActions', label: 'Bulk Actions', icon: CreditCard },
    { id: 'restore', label: 'Restore', icon: Shield },
    { id: 'tasks', label: 'Tasks', icon: Tasks },
    { id: 'companies', label: 'Companies', icon: Globe },
    { id: 'manageSmartLists', label: 'Manage Smart Lists', icon: Mail },
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
    <div className="contacts-page">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      <div className={`sidebar-container ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
        <Sidebar 
          menuItems={menuItems} 
          activeMenu={currentPage} 
          setActiveMenu={setCurrentPage}
          setMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>

      <div className="flex-1 lg:ml-64 p-8 pt-20">
        {renderPage()}
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default ContactsPage;