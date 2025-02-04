const amqp = require('amqplib');
const logger = require('./logger');
const { emitEvent } = require('./websocket');

let channel;

async function connectQueue() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange('user_events', 'topic', { durable: false });
    logger.info('Connected to RabbitMQ');
  } catch (error) {
    logger.error('RabbitMQ connection failed:', error);
    throw error;
  }
}

async function publishUserEvent(routingKey, data) {
  try {
    if (!channel) {
      await connectQueue();
    }
    
    channel.publish(
      'user_events',
      routingKey,
      Buffer.from(JSON.stringify(data))
    );
    
    // Emit the event through WebSocket
    emitEvent(routingKey, data);
    
    logger.info(`Event published: ${routingKey}`);
  } catch (error) {
    logger.error('Failed to publish event:', error);
    throw error;
  }
}

connectQueue().catch(error => {
  logger.error('Failed to connect to RabbitMQ:', error);
  process.exit(1);
});

module.exports = {
  publishUserEvent,
  connectQueue
}; 