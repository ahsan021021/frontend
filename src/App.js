import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './pages/GetStarted/Start';
import Login from './pages/login/login';
import SignUp from './pages/signup/signup';
import Verification from './pages/verifyEmail/Verification'; // Corrected import
import LeadSavvyDashboard from './pages/Dashboard/dashboard';
import UserCalendar from './components/UserCalendar'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<Verification />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<LeadSavvyDashboard />} />
        <Route path="/dashboard/calendar" element={<UserCalendar />} />

      </Routes>
    </Router>
  );
};

export default App;