/**
 * @fileOverview
 * Logger service, creates and exports a new logger object to be used by all services.
 */

/**
 * Import winston logger
 */
const winston = require('winston');

/**
 * Create new logger instance
 */
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: `${__dirname}/../../logs/debug.log`, json: false }),
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: `${__dirname}/../../logs/exceptions.log`, json: false }),
  ],
  exitOnError: false,
});

/**
 * Export logger object
 */
module.exports = logger;
