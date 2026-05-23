const client = require('prom-client');

// Create a Registry
const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
const userRegistrationsCounter = new client.Counter({
  name: 'auth_user_registrations_total',
  help: 'Total number of user registrations',
  labelNames: ['role'],
});

const userLoginsCounter = new client.Counter({
  name: 'auth_user_logins_total',
  help: 'Total number of user logins',
  labelNames: ['role', 'status'],
});

register.registerMetric(userRegistrationsCounter);
register.registerMetric(userLoginsCounter);

module.exports = {
  register,
  userRegistrationsCounter,
  userLoginsCounter,
};
