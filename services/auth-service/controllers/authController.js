const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getNats } = require('../config/nats');
const { StringCodec } = require('nats');
const { userRegistrationsCounter, userLoginsCounter } = require('../config/metrics');
const sc = StringCodec();

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role || 'worker'
    });

    try {
      const nats = getNats();
      nats.publish('user.registered', sc.encode(JSON.stringify({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      })));
    } catch (natsErr) {
      console.error('Failed to publish NATS event', natsErr);
    }

    // Increment Prometheus counter
    userRegistrationsCounter.inc({ role: newUser.role });

    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: newUser.id, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      userLoginsCounter.inc({ role: 'unknown', status: 'failed' });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      userLoginsCounter.inc({ role: user.role, status: 'failed' });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    userLoginsCounter.inc({ role: user.role, status: 'success' });

    res.status(200).json({ 
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Google OAuth Redirect
exports.googleRedirect = (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || 'mock_client_id';
  const redirectUri = encodeURIComponent(process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback');
  const scope = encodeURIComponent('profile email');
  const state = 'security_token';
  
  if (process.env.GOOGLE_CLIENT_ID) {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
    return res.redirect(googleAuthUrl);
  } else {
    console.log('Mocking Google OAuth redirect...');
    const mockCallbackUrl = `/api/auth/google/callback?code=mock_auth_code_12345&state=${state}`;
    return res.redirect(mockCallbackUrl);
  }
};

// Google OAuth Callback
exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: 'Authorization code missing' });
    }
    
    let email = 'mock_google_user@emapex.com';
    if (code === 'mock_auth_code_12345') {
      email = 'google_worker_test@emapex.com';
    }

    let user = await User.findOne({ where: { email } });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('random_password_123!', salt);
      
      user = await User.create({
        email,
        password: hashedPassword,
        role: 'worker'
      });
      
      try {
        const nats = getNats();
        nats.publish('user.registered', sc.encode(JSON.stringify({
          userId: user.id,
          email: user.email,
          role: user.role
        })));
      } catch (natsErr) {
        console.error('Failed to publish NATS user registration event', natsErr);
      }
    }

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

    res.redirect(`http://localhost:8080/index.html?token=${token}&workerId=${user.id}`);
  } catch (error) {
    console.error('Google Callback Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Google SDK Token Login
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'ID Token is required' });
    }
    
    let email = 'mock_google_sdk_user@emapex.com';
    
    let user = await User.findOne({ where: { email } });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('random_password_123!', salt);
      
      user = await User.create({
        email,
        password: hashedPassword,
        role: 'worker'
      });
      
      try {
        const nats = getNats();
        nats.publish('user.registered', sc.encode(JSON.stringify({
          userId: user.id,
          email: user.email,
          role: user.role
        })));
      } catch (natsErr) {
        console.error('Failed to publish NATS user registration event', natsErr);
      }
    }

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

    res.status(200).json({
      message: 'Google login successful',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Google Login SDK Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get User By ID (Inter-service API)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { attributes: ['id', 'email', 'role'] });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('GetUserById error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin only: Get all users/members
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role', 'createdAt']
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('GetAllUsers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin only: Delete user/member
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent self-deletion if they try
    if (req.user && req.user.id === id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('DeleteUser error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin only: Invite/Create a new user with any role
exports.inviteUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password and role are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role
    });

    try {
      const nats = getNats();
      nats.publish('user.registered', sc.encode(JSON.stringify({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      })));
    } catch (natsErr) {
      console.error('Failed to publish NATS event', natsErr);
    }

    // Increment Prometheus counter
    userRegistrationsCounter.inc({ role: newUser.role });

    res.status(201).json({
      message: 'User invited and registered successfully',
      user: { id: newUser.id, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('InviteUser error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

