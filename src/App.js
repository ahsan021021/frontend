import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Start from './pages/GetStarted/Start';
import Login from './pages/login/login';
import SignUp from './pages/signup/signup';
import Verification from './pages/verifyEmail/Verification';
import Dashboard from './pages/Dashboard/Dashboard';
import Contact from './pages/Contact/Contact';
import Calendar from './pages/Calendar/Calendar';
import OpportunitiesPage from './pages/Opportunities/OpportunitiesPage';
import SettingsPage from './pages/settings/SettingsPage';
import Conversation from './pages/Conversation/Conversation';
import Email from './pages/Email/Email';
import ImportCsvPage from './pages/ImportPage/ImportCsvPage';
import Scraper from './pages/Scrapper/Scrapper';
import SubscriptionPlans from './pages/Subscription/SubscriptionPlans';
import WelcomePage from './pages/Welcome/Welcome';
import ForgotPassword from './pages/forgetpassword/forgotpassword';
import Verify from './pages/verifyCode/verifyCode';
import ResetPassword from './pages/resetPage/resetPage';
import './App.css';

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<Verification />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
      <Route path="/contact" element={<PrivateRoute element={Contact} />} />
      <Route path="/calendar" element={<PrivateRoute element={Calendar} />} />
      <Route path="/settings" element={<PrivateRoute element={SettingsPage} />} />
      <Route path="/conversation" element={<PrivateRoute element={Conversation} />} />
      <Route path="/email" element={<PrivateRoute element={Email} />} />
      <Route path="/import" element={<PrivateRoute element={ImportCsvPage} />} />
      <Route path="/opportunities/*" element={<PrivateRoute element={OpportunitiesPage} />} />
      <Route path="/scraper" element={<PrivateRoute element={Scraper} />} />
      <Route path="/verify-code" element={<Verify />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

{/* Reset Password Page */}
<Route path="/reset-password" element={<ResetPassword />} />

    </Routes>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;