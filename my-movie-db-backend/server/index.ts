import './common/env';
import Server from './common/server';
import routes from './routes';
import logger from './common/logger';

//TODO: Have to add a bootstrap for the dependency injection

export const DEFAULT_ENTRY_SIZE = parseInt(process.env.DEFAULT_ENTRY_SIZE);

const port    = parseInt(process.env.PORT);
const server  = new Server();
const timeout = parseInt(process.env.TIMEOUT);

logger.debug(`${port}`);
logger.debug(process.env.MARIA_USER);
logger.debug(process.env.MARIA_PASSWORD);
logger.debug(process.env.MARIA_PORT);

start();

function start() {
    const initPromise = server.Setup();
    initPromise.catch((err) => {
        logger.error(err);
        logger.info('Try to connect again');
        setTimeout(() => {}, parseInt(process.env.RETRY_TIMEOUT) | 5000);
        start();
    });

    server.router(routes)
        .listen(port);
    server.configure(timeout);
}

function afterStart() {

}
