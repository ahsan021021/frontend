import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Users, CreditCard, Briefcase, Menu, ArrowLeft, Bell, Globe, Shield, Mail, Palette } from 'lucide-react';
import Sidebar from '../../components/Sidebar2';
import BusinessProfile from '../../components/BusinessProfile';
import MyProfile from '../../components/MyProfile';
import Billing from '../../components/Billing';
import Staff from '../../components/Staff';
import Opportunities from './Opportunities';
import Notifications from '../../components/Notifications';
import Localization from '../../components/Localization';
import Security from '../../components/Security';
import EmailSettings from '../../components/EmailSettings';
import Appearance from '../../components/Appearance';
import axios from '../../utils/axios'; // Import Axios instance with token
import './SettingsPage.css';

function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState('business');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [settings, setSettings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const menuItems = [
    { id: 'business', label: 'Business Profile', icon: Settings },
    { id: 'profile', label: 'My Profile', icon: Users },
    { id: 'localization', label: 'Localization', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'email', label: 'Email Settings', icon: Mail },
  ];

  const handleBack = () => {
    navigate('/dashboard');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'business':
        return <BusinessProfile />;
      case 'profile':
        return <MyProfile />;
      case 'billing':
        return <Billing />;
      case 'localization':
        return <Localization />;
      case 'email':
        return <EmailSettings />;
      default:
        return <BusinessProfile />;
    }
  };

  if (!showSettings) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Open CRM Settings
        </button>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={handleBack}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className={`sidebar-container ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
        <Sidebar
          menuItems={menuItems} 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu}
          setMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>

      <div className="main-content">
        {renderContent()}
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

export default SettingsPage;