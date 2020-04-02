import {singleton} from 'tsyringe';
import logger from '../../common/logger';
import ogmneo from 'ogmneo/index.js';
import {CsvLoaderManager} from '../csv-loader/csv-loader-manager';
import {DEFAULT_SIZE} from '../../index';

@singleton()
export class RepositoryService {

    public Dirty: boolean = true;

    constructor(private _csvLoaderManager: CsvLoaderManager) { }

    public async InitDatabase(): Promise<boolean> {
        try {
            logger.debug('Try to connect to the database.');
            ogmneo.Connection.connect(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD, process.env.NEO4J_HOST);
            logger.info(ogmneo.Connection.isConnected);
            ogmneo.Connection.logCypherEnabled = false; // For logging all raw queries
            logger.debug('Connected to database.');
            logger.debug('Dropping Database');
            // await this.ResetDatabase(-1);
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    public async ResetDatabase(count: number = DEFAULT_SIZE): Promise<boolean> {
        if(!this.Dirty) {
            return;
        }

        try {
            logger.debug(count.toString());
            await ogmneo.Cypher.transactionalWrite('MATCH (n) DETACH DELETE (n)');
            if(count > 0) {
                await this._csvLoaderManager.InitWithRelationships(count);
            }

            this.Dirty = false;
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

}
