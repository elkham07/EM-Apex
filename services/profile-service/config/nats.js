const { connect, StringCodec } = require('nats');
const profileController = require('../controllers/profileController');

let natsConnection = null;
const sc = StringCodec();

const connectNats = async () => {
  try {
    const serverUrl = process.env.NATS_URL || 'nats://nats:4222';
    natsConnection = await connect({ servers: serverUrl });
    console.log('Connected to NATS server');

    // Subscribe to payment.completed events
    const sub = natsConnection.subscribe('payment.completed');
    console.log('Subscribed to payment.completed');
    
    for await (const msg of sub) {
      try {
        const data = JSON.parse(sc.decode(msg.data));
        console.log(`Received completed payment for worker: ${data.workerId}`);
        await profileController.updateProfileXP(data);
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
