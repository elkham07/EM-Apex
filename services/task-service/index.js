const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const Task = require('./models/Task');
const Announcement = require('./models/Announcement');
const taskRoutes = require('./routes/taskRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Routes
app.use('/', taskRoutes);
app.use('/announcements', announcementRoutes);

const { connectRedis } = require('./config/redis');

// Database connection and server start
sequelize.sync({ alter: true }).then(async () => {
  console.log('Database connected and Task model synced');
  
  await connectRedis();
  
  app.listen(PORT, () => {
    console.log(`Task Service is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});
