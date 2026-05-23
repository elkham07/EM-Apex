const { register, login } = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getNats } = require('../config/nats');

// Mock User Model
jest.mock('../models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked_token'),
}));

// Mock NATS
jest.mock('../config/nats', () => ({
  getNats: jest.fn().mockReturnValue({
    publish: jest.fn(),
  }),
}));

describe('Auth Service Controllers', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('Registration', () => {
    it('should successfully register a new user', async () => {
      req.body = { email: 'new@example.com', password: 'password123', role: 'worker' };
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 'user-uuid', email: 'new@example.com', role: 'worker' });

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'new@example.com' } });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(User.create).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'hashed_password',
        role: 'worker',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: { id: 'user-uuid', email: 'new@example.com', role: 'worker' },
      });
    });

    it('should fail if user already exists', async () => {
      req.body = { email: 'existing@example.com', password: 'password123' };
      User.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'existing@example.com' } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });

  describe('Login', () => {
    it('should successfully log in with correct credentials', async () => {
      req.body = { email: 'user@example.com', password: 'password123' };
      User.findOne.mockResolvedValue({
        id: 'user-uuid',
        email: 'user@example.com',
        password: 'hashed_password',
        role: 'worker',
      });
      bcrypt.compare.mockResolvedValue(true);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'user@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: 'mocked_token',
        user: { id: 'user-uuid', email: 'user@example.com', role: 'worker' },
      });
    });

    it('should fail with invalid credentials (user not found)', async () => {
      req.body = { email: 'unknown@example.com', password: 'password123' };
      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should fail with invalid credentials (password mismatch)', async () => {
      req.body = { email: 'user@example.com', password: 'wrongpassword' };
      User.findOne.mockResolvedValue({
        email: 'user@example.com',
        password: 'hashed_password',
      });
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });
});
