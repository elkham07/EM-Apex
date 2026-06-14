const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  reward: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'closed'),
    defaultValue: 'active',
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false, // will store Admin User ID
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deadline: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accessStatus: {
    type: DataTypes.ENUM('open', 'closed'),
    defaultValue: 'closed',
  },
  assignedTo: {
    type: DataTypes.STRING,
    defaultValue: 'All',
  }
}, {
  timestamps: true,
});

module.exports = Task;
