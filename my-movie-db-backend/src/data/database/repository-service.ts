import {injectable} from 'tsyringe';
import logger from '../../common/logger';
import ogmneo from "ogmneo/index.js";
import {CsvLoaderManager} from '../csv-loader/csv-loader-manager';

@injectable()
export class RepositoryService {

    constructor(private _csvLoaderManager: CsvLoaderManager) { }

    public async InitDatabase(): Promise<boolean> {
        try {
            logger.debug('Try to connect to the database.');
            await ogmneo.Connection.connect(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD, process.env.NEO4J_HOST);
            ogmneo.Connection.logCypherEnabled = false; // For logging all raw queries
            logger.debug('Connected to database.');
            logger.debug('Dropping Database');
            await this.ResetDatabase(-1);
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    public async ResetDatabase(count: number = 1000): Promise<boolean> {
        try {
            await ogmneo.Cypher.transactionalWrite('MATCH (n) DETACH DELETE (n)');
            if(count > 0) {
                await this._csvLoaderManager.Init(count);
            }
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

}