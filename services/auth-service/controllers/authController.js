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
