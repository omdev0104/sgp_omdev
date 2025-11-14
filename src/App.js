// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Certificate from './pages/Certificate';
import Template from './pages/Template';
import Library from './pages/Library';

const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

const MainLayout = () => {
  const location = useLocation();

  // Routes jaha par Navbar nahi dikhani hai
  const hideNavbarRoutes = ['/signup', '/login'];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/certificate" element={<Certificate />} />
        
        <Route path="/template" element={<Template />} />
        <Route path="/library" element={<Library />} />
      </Routes>
    </>
  );
};

export default App;
