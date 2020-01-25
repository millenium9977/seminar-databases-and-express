import pino from 'pino';

const logger = pino({
    name: process.env.APP_ID,
    level: process.env.LOG_LEVEL,
    prettyPrint: {
        colorize: true,
        timestampKey: 'time',
        translateTime: true,
    },
    timestamp: true,
    useLevelLabels: true,
});

export default logger;
