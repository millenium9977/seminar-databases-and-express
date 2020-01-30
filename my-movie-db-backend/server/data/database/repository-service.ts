import {injectable}                   from 'tsyringe';
import TypeOrmConfig                  from './ormconfig';
import {Connection, createConnection} from 'typeorm';
import logger                         from '../../common/logger';

@injectable()
export class RepositoryService {

    public async InitDatabase(): Promise<boolean> {
        try {
            logger.debug('Try to connect to the database.');
            const connection: Connection = await createConnection(TypeOrmConfig);
            logger.debug('Connected to database.');
            logger.debug('Dropping Database');
            await connection.dropDatabase();
            logger.debug('Synchronizing Database');
            await connection.synchronize();
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }
}
