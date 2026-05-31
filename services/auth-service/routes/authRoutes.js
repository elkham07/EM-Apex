const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Google OAuth
router.get('/google', authController.googleRedirect);
router.get('/google/callback', authController.googleCallback);
router.post('/google-login', authController.googleLogin);

// Admin-only User Management
router.get('/users', verifyToken, isAdmin, authController.getAllUsers);
router.delete('/users/:id', verifyToken, isAdmin, authController.deleteUser);
router.post('/invite', verifyToken, isAdmin, authController.inviteUser);

// Inter-service Communication
router.get('/users/:id', authController.getUserById);

module.exports = router;
