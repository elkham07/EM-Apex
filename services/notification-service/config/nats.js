const { connect, StringCodec } = require('nats');
const emailService = require('../services/emailService');

let natsConnection = null;
const sc = StringCodec();

const connectNats = async () => {
  try {
    const serverUrl = process.env.NATS_URL || 'nats://nats:4222';
    natsConnection = await connect({ servers: serverUrl });
    console.log('Connected to NATS server');

    // Subscribe to multiple events
    const events = ['user.registered', 'submission.approved', 'payment.completed'];
    
    events.forEach(eventName => {
      const sub = natsConnection.subscribe(eventName);
      console.log(`Subscribed to ${eventName}`);
      
      (async () => {
        for await (const msg of sub) {
          try {
            const data = JSON.parse(sc.decode(msg.data));
            console.log(`Received event ${eventName}:`, data);
            
            // Handle different events
            if (eventName === 'user.registered') {
              await emailService.sendEmail(
                data.email, 
                'Welcome to EM Apex!', 
                'Thank you for joining our platform. Start completing tasks to earn money!'
              );
            } else if (eventName === 'submission.approved') {
              await emailService.sendEmail(
                'worker@example.com', 
                'Task Approved!', 
                `Your submission ${data.submissionId} has been approved. Payment is being processed.`
              );
            } else if (eventName === 'payment.completed') {
              await emailService.sendEmail(
                'worker@example.com', 
                'Payment Received!', 
                `You have received $${data.amount} for your approved work.`
              );
            }

          } catch (err) {
            console.error(`Error processing NATS message for ${eventName}:`, err);
          }
        }
      })();
    });

  } catch (err) {
    console.error('Error connecting to NATS', err);
  }
};

module.exports = { connectNats };
