const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sentBy: {
    type: DataTypes.STRING,
    defaultValue: 'Admin',
  },
}, {
  timestamps: true,
});

module.exports = Announcement;
