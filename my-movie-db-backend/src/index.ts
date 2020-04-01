import './common/env';
import Server from './common/server';
import routes from './routes';
import logger from './common/logger';

export const DEFAULT_SIZE = parseInt(process.env.DEFAULT_ENTRY_SIZE);

const port = parseInt(process.env.PORT);
const server = new Server();
const timeout = parseInt(process.env.TIMEOUT);

logger.debug(process.env.PORT);
logger.debug(process.env.NEO4J_HOST);
logger.debug(process.env.NEO4J_USERNAME);
logger.debug(process.env.NEO4J_PASSWORD);

const initPromise = server.Setup();


initPromise.then(server => {
    server.router(routes).listen(port);
    server.configure(timeout);
});
initPromise.catch(err =>
    logger.error(err)
);
