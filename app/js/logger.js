// Load in dependencies
var app     = require('electron').app;
var path    = require('path');
var winston = require('winston');

// Load constants
var logPath = path.join(app.getPath('userData'), 'verbose.log');

// Logger setup
module.exports = function (options) {
  var logger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        level: options.verbose ? 'silly' : 'info',
        colorize: true,
        timestamp: true
      }),
      new winston.transports.File({
        level: 'silly',
        filename: logPath,
        colorize: false,
        timestamp: true
      })
    ]
  });
  logger.info('\n\n Logger initialized. Writing all logs to "%s"', logPath);
  return logger;
};
