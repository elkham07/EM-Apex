const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// TODO: Add Auth Middleware to check roles
router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);

module.exports = router;
