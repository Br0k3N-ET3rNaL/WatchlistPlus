const winston = require('winston');

const consoleTransport = new winston.transports.Console();
const myWinstonOptions = {
    transports: [consoleTransport],
};
// eslint-disable-next-line new-cap
const logger = new winston.createLogger(myWinstonOptions);

class APILogger {
    info(message, data) {
        logger.info(`${message}   ${undefined !== data ? JSON.stringify(data) : ''}`);
    }

    error(message) {
        logger.error(message);
    }
}

module.exports = new APILogger();
