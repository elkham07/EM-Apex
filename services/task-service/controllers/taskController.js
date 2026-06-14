const Task = require('../models/Task');
const { getRedisClient } = require('../config/redis');

const checkUserSuspended = async (userId) => {
  try {
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
    const res = await fetch(`${authServiceUrl}/api/auth/users/${userId}`);
    if (res.ok) {
      const user = await res.json();
      return user.status === 'suspended';
    }
  } catch (err) {
    console.error('Failed to check user suspension status:', err.message);
  }
  return false;
};

// Admin only: Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, reward, createdBy, deadline, fileUrl, accessStatus, assignedTo } = req.body;

    const newTask = await Task.create({
      title,
      description,
      reward,
      createdBy,
      deadline,
      fileUrl,
      accessStatus: accessStatus || 'closed',
      assignedTo: assignedTo || 'All'
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
    const userId = req.user.id;
    const role = req.user.role;

    if (role === 'admin') {
      // Admin sees all tasks
      const tasks = await Task.findAll({ order: [['createdAt', 'DESC']] });
      return res.status(200).json(tasks);
    }

    // Check user suspension
    const suspended = await checkUserSuspended(userId);
    if (suspended) {
      return res.status(403).json({ suspended: true, message: 'Your access to tasks has been permanently closed.' });
    }

    // Worker sees only active & open tasks assigned to 'All' or to them
    const { Op } = require('sequelize');
    const tasks = await Task.findAll({
      where: {
        status: 'active',
        accessStatus: 'open',
        [Op.or]: [
          { assignedTo: 'All' },
          { assignedTo: userId }
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin only: Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.destroy();

    // Invalidate Redis cache
    try {
      const redisClient = getRedisClient();
      if (redisClient && redisClient.isOpen) {
        await redisClient.del('active_tasks');
        console.log('Redis cache active_tasks invalidated due to task deletion');
      }
    } catch (redisErr) {
      console.error('Failed to invalidate Redis cache', redisErr);
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin only: Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, reward, status, deadline, fileUrl, accessStatus, assignedTo } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (reward !== undefined) task.reward = reward;
    if (status !== undefined) task.status = status;
    if (deadline !== undefined) task.deadline = deadline;
    if (fileUrl !== undefined) task.fileUrl = fileUrl;
    if (accessStatus !== undefined) task.accessStatus = accessStatus;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    await task.save();

    // Invalidate Redis cache
    try {
      const redisClient = getRedisClient();
      if (redisClient && redisClient.isOpen) {
        await redisClient.del('active_tasks');
      }
    } catch (redisErr) {
      console.error('Failed to invalidate Redis cache', redisErr);
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
