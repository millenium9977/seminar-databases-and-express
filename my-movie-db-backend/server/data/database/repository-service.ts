import {injectable, singleton} from 'tsyringe';
import TypeOrmConfig                                 from './ormconfig';
import {Connection, createConnection, getConnection} from 'typeorm';
import logger                                        from '../../common/logger';
import {CsvLoaderManager}                            from '../csv-loader/csv-loader-manager';
import {DEFAULT_ENTRY_SIZE} from '../../index';

@singleton()
export class RepositoryService {

    public Dirty: boolean = true;

    constructor(private _csvLoaderManager: CsvLoaderManager) {
    }

    public async InitDatabase(): Promise<boolean> {
        try {
            logger.debug('Try to connect to the database.');
            const connection: Connection = await createConnection(TypeOrmConfig);
            logger.debug('Connected to database.');

            await this.ResetDatabase();
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    public async ResetDatabase(): Promise<boolean> {
        try {
            const connection = getConnection();
            if(!connection) {
                return false;
            }

            await connection.dropDatabase();
            await connection.synchronize();

            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    public async ResetDatabaseWithoutRelations(count: number = DEFAULT_ENTRY_SIZE): Promise<Boolean> {
        if(this.Dirty) {
            return true;
        }

        try {
            await this.ResetDatabase();
            await this._csvLoaderManager.WithoutRelations(count);

            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    public async ResetDatabaseWithRelations(count: number = DEFAULT_ENTRY_SIZE): Promise<Boolean> {
        if(this.Dirty) {
            return true;
        }

        try {
            await this.ResetDatabase();
            await this._csvLoaderManager.WithRelations(count);

            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }
}