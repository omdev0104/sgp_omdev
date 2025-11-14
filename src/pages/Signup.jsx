// src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Star, Heart, Award, } from 'lucide-react';
import './Auth.css';


function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Save authentication data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', formData.name);
      
      // Navigate to home page
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="header">
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left side - Signup form */}
        <div className="auth-form-section">
          <div className="auth-box">
            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Join us today</p>
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="line-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
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
              
              <div className="form-group">
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
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
                {loading ? 'Signing up...' : 'Sign Up'}
                {!loading && <ArrowRight className="button-icon" />}
              </button>
            </form>
            
            <p className="auth-switch">
              Already have an account? <Link to="/login" className="switch-link">Login</Link>
            </p>
          </div>
        </div>
      </div>

        {/* Right side - Decorative content */}
        <div className="auth-decorative right-content">
          <div className="decorative-items">
            <div className="decorative-item">
              <div className="icon-wrapper">
                <Star className="decorative-icon" />
              </div>
              <div className="item-content">
                <h3>Premium Features</h3>
                <p>Unlock amazing Template and Design</p>
              </div>
            </div>
            <div className="decorative-item">
              <div className="icon-wrapper">
                <Heart className="decorative-icon" />
              </div>
              <div className="item-content">
                <h3>Community</h3>
                <p>Join thousands of happy users</p>
              </div>
            </div>
            <div className="decorative-item">
              <div className="icon-wrapper">
                <Award className="decorative-icon" />
              </div>
              <div className="item-content">
                <h3>Award Winning</h3>
                <p>Recognized for excellence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure consistent export for Signup page
// If Login page uses "export default function Login() {}" style, match it here for consistency
export default Signup;