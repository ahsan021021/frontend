import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css'; // Importing the external CSS file

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [noEmails, setNoEmails] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/signup", {
                email,
                username,
                password,
                noEmails,
            });
            console.log(response.data);
            setMessage("Signup successful! Please check your email for the verification code.");
            // Delay before redirecting to verification page
            setTimeout(() => {
                navigate('/verify-email', { state: { email } });
            }, 3000); // 3 seconds delay
        } catch (error) {
            console.error("There was an error signing up!", error);
            setMessage("Failed to sign up. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="left">
                <div className="login-header">Sign Up</div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="checkbox-container">
                        <input
                            id="no-emails"
                            type="checkbox"
                            checked={noEmails}
                            onChange={() => setNoEmails(!noEmails)}
                        />
                        <label htmlFor="no-emails">
                            I do not want to receive emails with advertising, news, suggestions or marketing promotions
                        </label>
                    </div>
                    {message && <div className="message">{message}</div>}
                    <button className="login-button" type="submit">Sign Up</button>
                </form>
                <div className="social-login">
                    <p>Or Sign Up Using</p>
                    <div className="social-icons">
                        <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                        <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-google"></i></a>
                        <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                        <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                        <a href="https://www.behance.net" target="_blank" rel="noopener noreferrer"><i className="fab fa-behance"></i></a>
                    </div>
                </div>
                <div className="signup">Already have an account? <a href="#">Login</a></div>
            </div>
            <div className="right">
                <div className="red-side"></div>
                <div className="title">Lead Savvy <span style={{ color: '#fff' }}>AI</span></div>
                <div className="subtitle">All in one! Helping businesses strive</div>
                <div className="image-container">
                <img src="http://127.0.0.1:52432/src/pages/images/illustration.png"alt="Illustration" />
                </div>
                <div className="red-bottom"></div>
            </div>
        </div>
    );
};

export default SignUp;