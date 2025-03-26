import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Verify = () => {
  const [code, setCode] = useState(""); // Verification code
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for the button
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email; // Get email from the Forgot Password page

  // Debugging: Log the email passed to the Verify page
  useEffect(() => {
    console.log("Email passed to Verify page:", email);
  }, [email]);

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setError("Please enter the verification code.");
      setMessage("");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Debugging: Log the request body
      console.log("Request body:", { email, verificationCode: code });

      const response = await axios.post("http://localhost:5000/api/verify-code", {
        email: email, // Ensure this is not undefined
        verificationCode: code, // Ensure this matches the backend field name
      });

      setMessage(response.data.message);
      setError("");
      setLoading(false);

      // Redirect to reset password page with email
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      console.error("Error verifying code:", error);
      setError(error.response?.data?.message || "Invalid or expired verification code.");
      setMessage("");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="left">
        <div className="verification-header">Verify Code</div>
        <div className="input-group">
          <label htmlFor="code">Verification Code</label>
          <input
            id="code"
            type="text"
            placeholder="Enter the verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}
        <button
          className="verify-button login-button"
          onClick={handleVerifyCode}
          disabled={loading} // Disable button while loading
        >
          {loading ? "VERIFYING..." : "VERIFY CODE"}
        </button>
      </div>
      <div className="right">
        <div className="red-side"></div>
        <div className="title">
          Lead Savvy <span style={{ color: "#fff" }}>AI</span>
        </div>
        <div className="subtitle">All in one! Helping businesses strive</div>
        <div className="image-container">
          <img
            src="http://127.0.0.1:5500/src/pages/images/illustration.png"
            alt="Illustration"
          />
        </div>
        <div className="red-bottom"></div>
      </div>
    </div>
  );
};

export default Verify;