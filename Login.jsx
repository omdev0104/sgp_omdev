// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add your login logic here (you can integrate Firebase or API later)
    console.log('Login data:', formData);
    sessionStorage.setItem("loggedInUser", formData.email); // Temporary login state
    navigate('/'); // redirect to homepage
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left side - Decorative content */}
        <div className="auth-decorative left-content">
          <div className="decorative-items">
            <div className="decorative-item">
              <div className="icon-wrapper">
                <Shield className="decorative-icon" />
              </div>
              <div className="item-content">
                <h3>Secure & Safe</h3>
                <p>Your data is protected with encryption</p>
              </div>
            </div>
            <div className="decorative-item">
              <div className="icon-wrapper">
                <Zap className="decorative-icon" />
              </div>
              <div className="item-content">
                <h3>Fast & Reliable</h3>
                <p>Lightning quick access anytime</p>
              </div>
            </div>
            <div className="decorative-item">
              <div className="icon-wrapper">
                <Globe className="decorative-icon" />
              </div>
              <div className="item-content">
                <h3>Global Access</h3>
                <p>Connect from anywhere in the world</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="auth-form-section">
          <div className="auth-box">
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Login to Your Account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="line-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="line-input"
                  />
                </div>
              </div>
              
              <button type="submit" className="auth-button">
                Login
                <ArrowRight className="button-icon" />
              </button>
            </form>
            
            <p className="auth-switch">
              Don't have an account? <Link to="/signup" className="switch-link">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;