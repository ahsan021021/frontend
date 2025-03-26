import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const location = useLocation();
  const navigate = useNavigate();

  // Get the email from the previous page (Verification Code Page)
  const email = location.state?.email;

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true); // Set loading to true when the request starts
    try {
      const response = await axios.post("http://localhost:5000/api/reset-password", {
        email,
        newPassword,
      });
      setMessage(response.data.message);
      setError("");
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after successful reset
      }, 2000); // 2 seconds delay
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Failed to reset password. Please try again.");
      setMessage("");
    } finally {
      setLoading(false); // Set loading to false when the request is complete
    }
  };

  return (
    <div className="container">
      <div className="left">
        <div className="reset-password-header">Reset Password</div>
        <div className="input-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}
        <button
          className="reset-password-button login-button"
          onClick={handleResetPassword}
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Resetting..." : "RESET PASSWORD"} {/* Show loading text */}
        </button>
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

export default ResetPassword;