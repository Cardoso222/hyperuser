const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
}

module.exports = {
  errorHandler
}; 