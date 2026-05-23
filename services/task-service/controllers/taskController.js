const Task = require('../models/Task');

// Admin only
exports.createTask = async (req, res) => {
  try {
    const { title, description, reward, createdBy } = req.body;
    // In a real scenario, createdBy comes from the JWT middleware req.user.id

    const newTask = await Task.create({
      title,
      description,
      reward,
      createdBy
    });

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
    const tasks = await Task.findAll({ where: { status: 'active' } });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
