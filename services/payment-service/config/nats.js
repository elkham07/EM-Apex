const { connect, StringCodec } = require('nats');
const paymentController = require('../controllers/paymentController');

let natsConnection = null;
const sc = StringCodec();

const connectNats = async () => {
  try {
    const serverUrl = process.env.NATS_URL || 'nats://nats:4222';
    natsConnection = await connect({ servers: serverUrl });
    console.log('Connected to NATS server');

    // Subscribe to submission.approved events
    const sub = natsConnection.subscribe('submission.approved');
    console.log('Subscribed to submission.approved');
    
    for await (const msg of sub) {
      try {
        const data = JSON.parse(sc.decode(msg.data));
        console.log(`Received approved submission: ${data.submissionId}`);
        await paymentController.processPayment(data);
      } catch (err) {
        console.error('Error processing NATS message:', err);
      }
    }
  } catch (err) {
    console.error('Error connecting to NATS', err);
  }
};

const getNats = () => {
  if (!natsConnection) {
    throw new Error('NATS connection not established');
  }
  return natsConnection;
};

module.exports = { connectNats, getNats };
