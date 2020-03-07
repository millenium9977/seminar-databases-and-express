import './common/env';
import Server from './common/server';
import routes from './routes';
import logger from './common/logger';

//TODO: Have to add a bootstrap for the dependency injection

export const DEFAULT_ENTRY_SIZE= parseInt(process.env.DEFAULT_ENTRY_SIZE);

const port        = parseInt(process.env.PORT);
const server      = new Server();
const initPromise = server.Setup();
const timeout = parseInt(process.env.TIMEOUT);
initPromise.then(
    (server) => {
        server.router(routes)
            .listen(port);
        server.configure(timeout);
    });
initPromise.catch((err) => logger.error(err));
