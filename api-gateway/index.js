const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'api-gateway' });
});

// Proxies
app.use('/api/auth', createProxyMiddleware({ 
  target: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001', 
  changeOrigin: true 
}));

app.use('/api/tasks', createProxyMiddleware({ 
  target: process.env.TASK_SERVICE_URL || 'http://task-service:3002', 
  changeOrigin: true 
}));

app.use('/api/submissions', createProxyMiddleware({ 
  target: process.env.SUBMISSION_SERVICE_URL || 'http://submission-service:3003', 
  changeOrigin: true 
}));

app.use('/api/payments', createProxyMiddleware({ 
  target: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004', 
  changeOrigin: true 
}));

app.use('/api/profile', createProxyMiddleware({ 
  target: process.env.PROFILE_SERVICE_URL || 'http://profile-service:3006', 
  changeOrigin: true 
}));

// Start gateway
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
