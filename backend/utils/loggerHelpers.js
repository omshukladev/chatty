import logger from "../utils/logger.js";

/**
 * Middleware to log all HTTP requests
 */
export const requestLogger = (req, res, next) => {
  logger.http(`${req.method} ${req.url} - IP: ${req.ip}`);
  next();
};

/**
 * Helper function to log errors with request context
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 */
export const logError = (err, req) => {
  logger.error(`Error: ${err.message} - Path: ${req.path} - Method: ${req.method} - IP: ${req.ip}`);

  if (err.stack) {
    logger.debug(`Stack: ${err.stack}`);
  }
};

/**
 * Examples of using different log levels
 */
export const logExamples = () => {
  logger.debug("This is a debug message with detailed information for developers");
  logger.info("This is an information message for general system events");
  logger.warn("This is a warning that something might be wrong");
  logger.error("This is an error that needs attention");
};
