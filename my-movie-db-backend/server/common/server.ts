import express            from 'express';
import {Application}      from 'express';
import path               from 'path';
import bodyParser         from 'body-parser';
import http               from 'http';
import os                 from 'os';
import cookieParser       from 'cookie-parser';
import installValidator   from './openapi';
import 'reflect-metadata';
import logger             from './logger';
import {container}        from 'tsyringe';
import {CsvLoaderManager} from '../data/csv-loader/csv-loader-manager';
import {DatabaseService}  from '../data/database/database-service';

const app = express();

export default class ExpressServer {
    private readonly _databaseService: DatabaseService;
    private readonly _csvLoaderManager: CsvLoaderManager;

    constructor() {
        const root = path.normalize(__dirname + '/../..');
        app.set('appPath', root + 'client');
        app.use(bodyParser.json({limit: process.env.REQUEST_LIMIT || '100kb'}));
        app.use(bodyParser.urlencoded({extended: true, limit: process.env.REQUEST_LIMIT || '100kb'}));
        app.use(bodyParser.text({limit: process.env.REQUEST_LIMIT || '100kb'}));
        // app.use(cookieParser(process.env.SESSION_SECRET));
        app.use(express.static(`${root}/public`));

        this._databaseService  = container.resolve(DatabaseService);
        this._csvLoaderManager = container.resolve(CsvLoaderManager);

        this.setup().catch((error) => logger.error(error));
    }

    private async setup(): Promise<void> {
        await this._databaseService.Setup();
        this._csvLoaderManager.LoadCSV();
    }

    public Router(routes: (app: Application) => void): ExpressServer {
        installValidator(app, routes);
        return this;
    }

    public Listen(p: string | number = process.env.PORT): Application {
        const welcome = port => () => logger.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}}`);
        http.createServer(app).listen(p, welcome(p));
        return app;
    }
}
