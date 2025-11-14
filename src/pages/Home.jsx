import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-container">
      <Navbar />

      <section className="hero">
        <div className="hero-content animate-on-scroll">
          <h1 className="hero-title">
            Create Professional
            <span className="accent-text">E-Certificates</span>
            in Minutes
          </h1>
          <p className="hero-subtitle">
            Transform your certification process with our powerful and easy-to-use platform.
            Generate, manage, and distribute certificates instantly.
          </p>
          <button 
            className="generate-btn"
            onClick={() => navigate('/certificate')}
          >
            Generate Certificate
            <span className="btn-icon">→</span>
          </button>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Certificates Generated</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Users</span>
            </div>
          </div>
        </div>
        <div className="hero-visual animate-on-scroll">
          <div className="certificate-preview">
            <div className="certificate-card main"></div>
            <div className="certificate-card overlay-1"></div>
            <div className="certificate-card overlay-2"></div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title animate-on-scroll">Why Choose Us?</h2>
        <div className="features-grid">
          {[
            {
              icon: "🚀",
              title: "Instant Generation",
              description: "Generate bulk certificates in seconds with our powerful engine"
            },
            {
              icon: "🎨",
              title: "Premium Templates",
              description: "Choose from 50+ professionally designed templates"
            },
            {
              icon: "🔄",
              title: "Easy Distribution",
              description: "Automatically send certificates via email to recipients"
            },
            {
              icon: "🔒",
              title: "Secure & Verified",
              description: "Each certificate comes with a unique verification system"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="feature-card animate-on-scroll"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="steps">
        <h2 className="section-title animate-on-scroll">How It Works</h2>
        <div className="steps-container">
          {[
            { number: "01", title: "Choose Template", desc: "Select from our premium designs" },
            { number: "02", title: "Add Content", desc: "Upload your data or fill manually" },
            { number: "03", title: "Generate", desc: "Get your certificates instantly" }
          ].map((step, index) => (
            <div 
              key={index}
              className="step-card animate-on-scroll"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
