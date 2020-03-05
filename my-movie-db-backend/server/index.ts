import './common/env';
import Server from './common/server';
import routes from './routes';
import logger from './common/logger';

//TODO: Have to add a bootstrap for the dependency injection

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
