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

// Prometheus Metrics Endpoint
const { register } = require('./config/metrics');
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const { connectNats } = require('./config/nats');

// Database connection and server start
sequelize.sync().then(async () => {
  console.log('Database connected and models synced');
  
  await connectNats();
  
  app.listen(PORT, () => {
    console.log(`Auth Service is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});
