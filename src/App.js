import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Start from './pages/GetStarted/Start';
import Login from './pages/login/login';
import SignUp from './pages/signup/signup';
import Verification from './pages/verifyEmail/Verification';
import LeadSavvyDashboard from './pages/Dashboard/LeadSavvyDashboard';
import Contact from './pages/Contact/Contact';
import Calendar from './pages/Calendar/Calendar';
import OpportunitiesPage from './pages/Opportunities/OpportunitiesPage';
import SettingsPage from './pages/settings/SettingsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<Verification />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<LeadSavvyDashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<SettingsPage/>}/>
        
        
        <Route path='/opportunities/*' element={<OpportunitiesPage/>}/>
      </Routes>
    </Router>
  );
};

export default App;