import {injectable} from 'tsyringe';
import logger from '../../common/logger';
import ogmneo from "ogmneo/index.js";

@injectable()
export class RepositoryService {

    public async InitDatabase(): Promise<boolean> {
        try {
            logger.debug('Try to connect to the database.');
            ogmneo.Connection.connect(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD, process.env.NEO4J_HOST);
            ogmneo.Connection.logCypherEnabled = false; // For logging all raw queries
            logger.debug('Connected to database.');
            logger.debug('Dropping Database');
            await ogmneo.Cypher.transactionalWrite('MATCH (n) DETACH DELETE (n)');
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }
}