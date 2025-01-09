import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './pages/GetStarted/Start';
import Login from './pages/login/login';
import SignUp from './pages/signup/signup';
import Verification from './pages/verifyEmail/Verification'; // Corrected import

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<Verification />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;