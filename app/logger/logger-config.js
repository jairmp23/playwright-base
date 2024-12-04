import pino from 'pino';

/**
 * Logger instance configured with Pino.
 * Adjust the configuration as needed.
 */
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true, 
      translateTime: 'SYS:standard',
    },
  },
});

export default logger;
