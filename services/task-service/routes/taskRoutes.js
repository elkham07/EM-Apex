const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// TODO: Add Auth Middleware to check roles
router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
