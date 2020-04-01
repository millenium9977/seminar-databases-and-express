import express            from 'express';
import {Application}      from 'express';
import path               from 'path';
import bodyParser         from 'body-parser';
import http, {Server}              from 'http';
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
    private server: Server = null;
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
    }

    public async Setup(): Promise<boolean> {
        return await this._databaseService.Setup();
        // await this._csvLoaderManager.LoadCSV();
    }

    public Router(routes: (app: Application) => void): ExpressServer {
        installValidator(app, routes);
        return this;
    }

    public Listen(p: string | number = process.env.PORT): Application {
        const welcome = port => () => logger.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}}`);
        this.server = http.createServer(app).listen(p, welcome(p));
        return app;
    }

    public Configure(timeout: number) : void {
        this.server.timeout = timeout;
    }
}
