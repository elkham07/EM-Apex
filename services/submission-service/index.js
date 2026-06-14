const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const { connectNats } = require('./config/nats');
const Submission = require('./models/Submission');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

// Routes
app.use('/', submissionRoutes);

// Initialize everything
const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('Database connected and Submission model synced');

    await connectNats();

    app.listen(PORT, () => {
      console.log(`Submission Service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
