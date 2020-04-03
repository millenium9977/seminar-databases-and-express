import './common/env';
import Server from './common/server';
import routes from './routes';
import logger from './common/logger';

export const DEFAULT_SIZE = parseInt(process.env.DEFAULT_ENTRY_SIZE);

const port    = parseInt(process.env.PORT);
const server  = new Server();
const timeout = 60000000;

logger.debug(process.env.PORT);
logger.debug(process.env.NEO4J_HOST);
logger.debug(process.env.NEO4J_USERNAME);
logger.debug(process.env.NEO4J_PASSWORD);

start();

server.router(routes).listen(port);
server.configure(timeout);

function start(): void {
    const initPromise = server.Setup();
    initPromise.catch(err => {
        logger.error(err);
        logger.info('Try to connect to database again');
        setTimeout(() => start(), parseInt(process.env.RETRY_TIMEOUT) | 5000);
    });
}
