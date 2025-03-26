import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Ensure this file exists in the same directory

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true); // Set loading to true when login starts
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      // If login is successful, store the token and navigate to the dashboard
      const { token } = response.data;
      localStorage.setItem("token", token);
      setMessage("Login successful!");
      navigate("/dashboard"); // Redirect to the dashboard page
    } catch (error) {
      console.error("There was an error logging in!", error);

      // Handle error messages from the backend
      const errorMessage = error.response?.data?.message;

      if (errorMessage === "Please verify your email first") {
        // Resend the verification email
        try {
          const resendResponse = await axios.post("http://localhost:5000/api/resend-verification-email", {
            email,
          });

          // Show a success message and redirect to the Verify page
          setMessage("Verification email sent. Redirecting to verification page...");
          setTimeout(() => {
            navigate("/verify-email", { state: { email } }); // Redirect to the Verify page with the email
          }, 1500); // 1.5-second delay
        } catch (resendError) {
          console.error("Error resending verification email:", resendError);
          setMessage("Failed to resend verification email. Please try again.");
        }
      } else {
        // Display other error messages
        setMessage(errorMessage || "Invalid email or password");
      }
    } finally {
      setLoading(false); // Set loading to false when login is complete
    }
  };

  return (
    <div className="container">
      <div className="left">
        <div className="login-header">Login</div>
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Type your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {message && <div className="message">{message}</div>}
        <div className="forgot-password">
          <a href="/forgot-password">Forgot password?</a>
        </div>
        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Logging in..." : "LOGIN"} {/* Show loading text */}
        </button>
        <div className="social-login">
          <p>Or Sign Up Using</p>
          <div className="social-icons">
            <a href="#">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-google"></i>
            </a>
          </div>
        </div>
        <div className="signup">
          Or Sign Up Using <a href="/signup">SIGN UP</a>
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
      <div className="social-icons">
        <a href="#" target="_blank">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="#" target="_blank">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" target="_blank">
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a href="#" target="_blank">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://www.behance.net" target="_blank">
          <i className="fab fa-behance"></i>
        </a>
      </div>
    </div>
  );
};

export default Login;