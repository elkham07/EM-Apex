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

// Prometheus Observability Setup
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

// Custom Express request metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Middleware to capture request duration
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;
    
    // We clean route names (e.g. remove query strings or dynamic UUIDs if applicable)
    const route = req.baseUrl + (req.route ? req.route.path : req.path);
    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode)
      .observe(durationInSeconds);
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'api-gateway' });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
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
