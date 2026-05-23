const Payment = require('../models/Payment');
const { StringCodec } = require('nats');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

const sc = StringCodec();

// Called automatically by NATS subscriber
exports.processPayment = async (data) => {
  const { submissionId, workerId, taskId } = data;
  
  try {
    // Mock reward amount for now
    const rewardAmount = 15.00; 

    const payment = await Payment.create({
      submissionId,
      workerId,
      amount: rewardAmount,
      status: 'pending'
    });

    console.log(`Processing Stripe transfer of $${rewardAmount} to worker ${workerId}...`);
    
    payment.status = 'completed';
    payment.stripeChargeId = 'ch_mock_12345';
    await payment.save();

    console.log(`Payment successful for submission ${submissionId}`);

    // Publish event: payment.completed
    const nats = require('../config/nats').getNats();
    nats.publish('payment.completed', sc.encode(JSON.stringify({
      paymentId: payment.id,
      workerId,
      amount: rewardAmount
    })));

  } catch (error) {
    console.error('Payment processing failed:', error);
  }
};

// REST API to view payments
exports.getWorkerPayments = async (req, res) => {
  try {
    const { workerId } = req.params;
    const payments = await Payment.findAll({ where: { workerId } });
    res.status(200).json(payments);
  } catch (error) {
    console.error('Fetch payments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
