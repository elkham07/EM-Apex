const Task = require('../models/Task');
const { getRedisClient } = require('../config/redis');

// Admin only
exports.createTask = async (req, res) => {
  try {
    const { title, description, reward, createdBy } = req.body;

    const newTask = await Task.create({
      title,
      description,
      reward,
      createdBy
    });

    // Invalidate Redis cache
    try {
      const redisClient = getRedisClient();
      if (redisClient && redisClient.isOpen) {
        await redisClient.del('active_tasks');
        console.log('Redis cache active_tasks invalidated');
      }
    } catch (redisErr) {
      console.error('Failed to invalidate Redis cache', redisErr);
    }

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Worker & Admin
exports.getAllTasks = async (req, res) => {
  try {
    const redisClient = getRedisClient();
    
    // Attempt to fetch from Redis cache
    if (redisClient && redisClient.isOpen) {
      try {
        const cachedTasks = await redisClient.get('active_tasks');
        if (cachedTasks) {
          console.log('Serving tasks from Redis cache');
          return res.status(200).json(JSON.parse(cachedTasks));
        }
      } catch (redisErr) {
        console.error('Error reading from Redis cache', redisErr);
      }
    }

    // Fetch from database
    const tasks = await Task.findAll({ where: { status: 'active' } });
    
    // Store in Redis cache for 1 hour (3600 seconds)
    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.set('active_tasks', JSON.stringify(tasks), { EX: 3600 });
        console.log('Tasks stored in Redis cache');
      } catch (redisErr) {
        console.error('Error writing to Redis cache', redisErr);
      }
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
