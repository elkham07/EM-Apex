const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('worker', 'admin'),
    allowNull: false,
    defaultValue: 'worker',
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended'),
    allowNull: false,
    defaultValue: 'active',
  },
}, {
  timestamps: true,
});

module.exports = User;
