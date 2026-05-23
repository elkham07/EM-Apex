const { connect } = require('nats');

let natsConnection = null;

const connectNats = async () => {
  try {
    const serverUrl = process.env.NATS_URL || 'nats://nats:4222';
    natsConnection = await connect({ servers: serverUrl });
    console.log('Connected to NATS server');
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
