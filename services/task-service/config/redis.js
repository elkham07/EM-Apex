const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
    redisClient = redis.createClient({ url: redisUrl });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    await redisClient.connect();
    console.log('Connected to Redis server for task-service');
  } catch (err) {
    console.error('Failed to connect to Redis, continuing without caching', err);
  }
};

const getRedisClient = () => {
  return redisClient;
};

module.exports = { connectRedis, getRedisClient };
