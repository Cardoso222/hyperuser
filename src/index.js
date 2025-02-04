require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { createClient } = require('redis');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB');

    const redisClient = createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();
    logger.info('Connected to Redis');

    global.redisClient = redisClient;

    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 