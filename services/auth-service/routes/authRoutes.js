const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Google OAuth
router.get('/google', authController.googleRedirect);
router.get('/google/callback', authController.googleCallback);
router.post('/google-login', authController.googleLogin);

// Inter-service Communication
router.get('/users/:id', authController.getUserById);

module.exports = router;
