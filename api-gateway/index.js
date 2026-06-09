import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import 'dotenv/config';
import client from 'prom-client';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('combined'));

// Prometheus Observability Setup
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

const proxyOptions = (target, { pathRewrite } = {}) => ({
  target,
  changeOrigin: true,
  proxyTimeout: 30000,
  pathRewrite,
  onError: (err, req, res) => {
    console.error(`[proxy] ${req.method} ${req.url} → ${target}:`, err.message);
    if (!res.headersSent) {
      res.status(502).json({ message: 'Upstream service unavailable' });
    }
  },
});

// Auth routes live at /api/auth on the service; Express mount strips that prefix.
app.use(
  '/api/auth',
  createProxyMiddleware(
    proxyOptions(process.env.AUTH_SERVICE_URL || 'http://auth-service:3001', {
      pathRewrite: (path) => `/api/auth${path === '/' ? '' : path}`,
    })
  )
);

// Task/submission/payment/profile services mount routes at /
app.use(
  '/api/tasks',
  createProxyMiddleware(proxyOptions(process.env.TASK_SERVICE_URL || 'http://task-service:3002'))
);
app.use(
  '/api/announcements',
  createProxyMiddleware(
    proxyOptions(process.env.TASK_SERVICE_URL || 'http://task-service:3002', {
      pathRewrite: (path) => `/announcements${path === '/' ? '' : path}`,
    })
  )
);
app.use(
  '/api/submissions',
  createProxyMiddleware(
    proxyOptions(process.env.SUBMISSION_SERVICE_URL || 'http://submission-service:3003')
  )
);
app.use(
  '/api/payments',
  createProxyMiddleware(
    proxyOptions(process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004')
  )
);
app.use(
  '/api/profile',
  createProxyMiddleware(
    proxyOptions(process.env.PROFILE_SERVICE_URL || 'http://profile-service:3006')
  )
);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
