import './common/env';
import Server from './common/server';
import routes from './routes';
import logger from './common/logger';

export const DEFAULT_SIZE = parseInt(process.env.DEFAULT_ENTRY_SIZE);

const port                = parseInt(process.env.PORT);
const timeout             = parseInt(process.env.TIMEOUT);
const server              = new Server();
const init: Promise<boolean> = server.Setup();

init.then((res) => {
    if(!res) {
        return;
    }
    server
        .Router(routes)
        .Listen(port);
    server.Configure(timeout);
});
init.catch((err) => {
    logger.debug(err);
    return;
});
