const { Server } = require('socket.io');
const logger = require('./logger');

let io;

function initializeWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    logger.info('Client connected to WebSocket');

    socket.on('disconnect', () => {
      logger.info('Client disconnected from WebSocket');
    });
  });

  return io;
}

function emitEvent(eventName, data) {
  if (io) {
    io.emit(eventName, data);
    logger.info(`WebSocket event emitted: ${eventName}`);
  }
}

module.exports = {
  initializeWebSocket,
  emitEvent
}; 