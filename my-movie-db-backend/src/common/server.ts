import express from 'express';
import {Application} from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http, {Server} from 'http';
import os from 'os';
import installValidator from './openapi';
import 'reflect-metadata';
import logger from './logger';
import {container} from 'tsyringe';
import {CsvLoaderManager} from '../data/csv-loader/csv-loader-manager';
import {RepositoryService} from '../data/database/repository-service';

const app = express();
const cors = require('cors');

export default class ExpressServer {

    private readonly _csvLoaderManager: CsvLoaderManager;
    private readonly _repositoryService: RepositoryService;
    private server: Server = null;

    constructor() {
        const root = path.normalize(__dirname + '/../..');

        app.set('appPath', root + 'client');
        app.use(bodyParser.json({limit: process.env.REQUEST_LIMIT || '100kb'}));
        app.use(bodyParser.urlencoded({extended: true, limit: process.env.REQUEST_LIMIT || '100kb'}));
        app.use(bodyParser.text({limit: process.env.REQUEST_LIMIT || '100kb'}));
        app.use(express.static(`${root}/public`));
        app.use(cors());

        this._csvLoaderManager   = container.resolve(CsvLoaderManager);
        this._repositoryService = container.resolve(RepositoryService);
    }

    public async Setup(): Promise<ExpressServer> {
        const connectionStatus: boolean = await this._repositoryService.InitDatabase();
        if(!connectionStatus) {
            throw new Error('Wasn\'t able to establish a connection to the database');
        }
        // await this._csvLoaderManager.LoadCSV();
        return this;
    }

    router(routes: (app: Application) => void): ExpressServer {
        installValidator(app, routes);
        return this;
    }

    listen(p: string | number = process.env.PORT): Application {
        const welcome = port => () => logger.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}}`);
        this.server = http.createServer(app).listen(p, welcome(p));
        return app;
    }

    public configure(timeout: number) {
        this.server.timeout = timeout;
        logger.debug(`Timeout is set to ${timeout}ms`);
    }

}
