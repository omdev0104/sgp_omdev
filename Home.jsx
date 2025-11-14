import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const styles = {
    container: {
      fontFamily: 'sans-serif',
      padding: '20px',
      textAlign: 'left',
    },
    header: {
      width: 600,
      backgroundColor: '#e7ebf4ff',
      marginTop: '200px',
      padding: '50px',
      borderRadius: '8px',
    },
    title: {  
      fontSize: '2rem',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#555',
    },
    button: {
      marginTop: '20px',
      padding: '12px 24px',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
    },
    featuresSection: {
      marginTop: '40px',
    },
    featuresList: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      flexWrap: 'wrap',
      marginTop: '20px',
    },
    featureBox: {
      backgroundColor: '#e6ecff',
      padding: '20px',
      width: '250px',
      borderRadius: '8px',
      boxShadow: '0 0 5px rgba(0,0,0,0.1)',
    },
    footer: {
      marginTop: '50px',
      fontSize: '14px',
      color: '#666',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Charotar University of Science and Technology</h1>
        <p style={styles.subtitle}>Welcome to the official E-Certificate Portal</p>
        <Link to="/login">
          <button style={styles.button}>Get Started</button>
        </Link>
      </header>

      <section style={styles.featuresSection}>
        <h2>Key Features</h2>
        <div style={styles.featuresList}>
          <div style={styles.featureBox}>
            <h3>Upload CSV</h3>
            <p>Upload student data to generate certificates.</p>
          </div>
          <div style={styles.featureBox}>
            <h3>Edit Message</h3>
            <p>Customize the message and subject of the certificate.</p>
          </div>
          <div style={styles.featureBox}>
            <h3>Send Certificate</h3>
            <p>Download or email certificates easily.</p>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>© 2025 Charusat University | All rights reserved</p>
      </footer>
    </div>
  );
};

export default Home;
