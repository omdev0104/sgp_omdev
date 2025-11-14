const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Enable better error logging
mongoose.set('debug', true);

const app = express();
const User = require('./models/User');
const Certificate = require('./models/Certificate');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with detailed error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('Database name:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('MongoDB connection error details:', {
      name: err.name,
      message: err.message,
      code: err.code
    });
    process.exit(1);
  });

// Routes
app.post('/api/signup', async (req, res) => {
  console.log('Received signup request:', req.body);
  
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      console.log('Missing required fields:', { 
        hasEmail: !!email, 
        hasPassword: !!password, 
        hasName: !!name 
      });
      return res.status(400).json({ 
        message: 'All fields are required',
        details: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          name: !name ? 'Name is required' : null
        }
      });
    }

    // Check if user exists
    console.log('Checking if user exists:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    console.log('Creating new user:', { name, email });
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    try {
      await user.save();
      console.log('User saved successfully:', user._id);
    } catch (saveError) {
      console.error('Error saving user:', {
        error: saveError.message,
        code: saveError.code,
        name: saveError.name
      });
      throw saveError;
    }

    // Create token
    console.log('Generating token...');
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Signup successful for:', email);
    res.status(201).json({ 
      message: 'User created successfully',
      token, 
      userId: user._id,
      name: user.name 
    });
  } catch (error) {
    console.error('Signup error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      details: error.message 
    });
  }
});

// Certificate Routes
app.post('/api/certificates', async (req, res) => {
  try {
    const { name, type, data, templateUsed } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const certificate = new Certificate({
      userId,
      name,
      type,
      data,
      templateUsed
    });

    await certificate.save();
    res.status(201).json({
      message: 'Certificate created successfully',
      certificate
    });
  } catch (error) {
    console.error('Certificate creation error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

app.get('/api/certificates', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const certificates = await Certificate.find({ userId });
    res.json(certificates);
  } catch (error) {
    console.error('Fetch certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/certificates/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const certificate = await Certificate.findOne({
      _id: req.params.id,
      userId
    });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    console.error('Fetch certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, userId: user._id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Email sending route
app.post('/api/certificates/send-email', async (req, res) => {
  try {
    const { projectId, message } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Find the project certificates
    const project = await Certificate.findOne({ _id: projectId, userId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send emails to all students
    const emailPromises = project.certificates.map((cert) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: cert.email,
        subject: `Certificate for ${project.name}`,
        text: `${message}\n\nCertificate Details:\nName: ${cert.name}\nTemplate: ${project.templateUsed}\nDate: ${new Date(project.createdAt).toLocaleString()}`,
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
