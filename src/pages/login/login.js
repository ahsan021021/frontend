import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Ensure this file exists in the same directory

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://localhost:5000/api/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setMessage("Login successful!");
      navigate("/conversations"); // Redirect to the conversations page
    } catch (error) {
      console.error("There was an error logging in!", error);
      setMessage("Invalid email or password");
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
        <div className="forgot-password">Forgot password?</div>
        <button className="login-button" onClick={handleLogin}>
          LOGIN
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
          Or Sign Up Using <a href="#">SIGN UP</a>
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