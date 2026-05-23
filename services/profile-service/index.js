const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const { connectNats } = require('./config/nats');
const Profile = require('./models/Profile');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

app.use('/', profileRoutes);

const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('Database connected and Profile model synced');

    await connectNats();

    app.listen(PORT, () => {
      console.log(`Profile Service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
