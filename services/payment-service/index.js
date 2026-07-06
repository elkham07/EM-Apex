const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const { connectNats } = require('./config/nats');
const Payment = require('./models/Payment');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.use('/', paymentRoutes);

const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database connected and Payment model synced');

    await connectNats();

    app.listen(PORT, () => {
      console.log(`Payment Service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

