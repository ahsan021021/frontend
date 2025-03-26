import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/forgot-password", {
        email,
      });
      setMessage(response.data.message);
      setError("");
      navigate("/verify-code", { state: { email } }); // Redirect to verification code page with email
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setError("Failed to send reset email. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="container">
      <div className="left">
        <div className="forgot-password-header">Forgot Password</div>
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}
        <button className="forgot-password-button login-button" onClick={handleForgotPassword}>
          SEND RESET CODE
        </button>
        <div className="back-to-login">
          Remembered your password? <a href="/login">Login</a>
        </div>
      </div>
      <div className="right">
        <div className="red-side"></div>
        <div className="title">
          Lead Savvy <span style={{ color: "#fff" }}>AI</span>
        </div>
        <div className="subtitle">All in one! Helping businesses strive</div>
        <div className="image-container">
          <img src="http://127.0.0.1:5500/src/pages/images/illustration.png" alt="Illustration" />
        </div>
        <div className="red-bottom"></div>
      </div>
    </div>
  );
};

export default ForgotPassword;