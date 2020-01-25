import './common/env';
import Server from './common/server';
import routes from './routes';

//TODO: Have to add a bootstrap for the dependency injection

const port = parseInt(process.env.PORT);
export default new Server()
    .Router(routes)
    .Listen(port);
