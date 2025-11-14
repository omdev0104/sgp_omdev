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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear any previous errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem("loggedInUser", formData.email);

      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
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
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
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
              
              <button 
                type="submit" 
                className="auth-button" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
                {!loading && <ArrowRight className="button-icon" />}
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