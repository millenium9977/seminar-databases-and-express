import {injectable}       from 'tsyringe';
import TypeOrmConfig      from './ormconfig';
import {createConnection} from 'typeorm';
import logger             from '../../common/logger';

@injectable()
export class RepositoryService {

    public async InitDatabase(): Promise<boolean> {
        try {
            logger.debug('Try to connect to the database.');
            await createConnection(TypeOrmConfig);
            logger.debug('Connected to database.');
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }
}
