import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Verification = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Track loading state
    const location = useLocation();
    const navigate = useNavigate();
    const { email } = location.state || {};

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when verification starts
        try {
            const response = await axios.post("http://82.180.137.7:5000/api/verify-email", {
                email,
                verificationCode,
            });
            console.log(response.data);
            const { token } = response.data;
            localStorage.setItem("token", token);
            setMessage("Email verified successfully!");
            // Delay before redirecting to the welcome page
            setTimeout(() => {
                navigate('/welcome');
            }, 3000); // 3 seconds delay
        } catch (error) {
            console.error("There was an error verifying the email!", error);
            setMessage("Invalid verification code. Please try again.");
        } finally {
            setLoading(false); // Set loading to false when verification is complete
        }
    };

    return (
        <div className="container">
            <div className="left">
                <div className="login-header">Verification</div>
                <form onSubmit={handleVerify}>
                    <div className="input-group">
                        <label htmlFor="verificationCode">Verification Code</label>
                        <input
                            id="verificationCode"
                            type="text"
                            placeholder="Enter your verification code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                    </div>
                    {message && <div className="message">{message}</div>}
                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading} // Disable the button while loading
                    >
                        {loading ? "Verifying..." : "Submit"} {/* Show loading text */}
                    </button>
                </form>
            </div>
            <div className="right">
                <div className="red-side"></div>
                <div className="title">
                    Lead Savvy <span style={{ color: "#fff" }}>AI</span>
                </div>
                <div className="subtitle">All in one! Helping businesses strive</div>
                <div className="image-container">
                    <img src="http://127.0.0.1:52432/src/pages/images/illustration.png" alt="Illustration" />
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

export default Verification;