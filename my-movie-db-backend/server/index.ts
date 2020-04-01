import './common/env';
import Server from './common/server';
import routes from './routes';
import logger from './common/logger';

export const DEFAULT_SIZE = parseInt(process.env.DEFAULT_ENTRY_SIZE);

const port                = parseInt(process.env.PORT);
const timeout             = parseInt(process.env.TIMEOUT);
const server              = new Server();


logger.debug(process.env.PORT);
logger.debug(process.env.CONNECTION_URI);

start();

server
    .Router(routes)
    .Listen(port);
server.Configure(timeout);

function start(): void {
    const init: Promise<boolean> = server.Setup();
    init.catch((err) => {
        logger.debug(err);
        logger.debug('Try to connect again');
        setTimeout(() => start(), parseInt(process.env.RETRY_TIMEOUT) | 5000);
    });
}


