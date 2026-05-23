const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'auth-service' });
});

// Mock endpoints for now
app.post('/api/auth/register', (req, res) => {
  res.status(201).json({ message: 'User registered' });
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({ token: 'mock-jwt-token' });
});

// Database connection and server start
sequelize.sync().then(() => {
  console.log('Database connected and models synced');
  app.listen(PORT, () => {
    console.log(`Auth Service is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});
