const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  submissionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  workerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  stripeChargeId: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Payment;
