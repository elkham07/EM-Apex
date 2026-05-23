const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectNats } = require('./config/nats');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'notification-service' });
});

const startServer = async () => {
  try {
    await connectNats();

    app.listen(PORT, () => {
      console.log(`Notification Service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
