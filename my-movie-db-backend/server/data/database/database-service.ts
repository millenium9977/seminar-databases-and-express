import mongoose, {Connection} from 'mongoose';
import logger                 from '../../common/logger';
import {injectable}           from 'tsyringe';
import {CsvLoaderManager}     from '../csv-loader/csv-loader-manager';

@injectable()
export class DatabaseService {

    constructor(private csvLoaderManager: CsvLoaderManager) {
    }

    public async Setup(): Promise<boolean> {
        try {
            logger.debug('Try to connect to database');
            await mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true, useUnifiedTopology: true});
            this.ResetDB();
            logger.debug('Seem\'s like we got it!');
            return true;
        } catch (error) {
            logger.error(error);
            return false;
        }
    }

    public async ResetDB(): Promise<void> {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.useDb('moviedb');
    }

    public async ResetNoRelations(count: number = 100): Promise<void> {
        await this.ResetDB();
        await this.csvLoaderManager.LoadData(count, false);
    }

    public async ResetWithRelations(count: number = 100): Promise<void> {
        await this.ResetDB();
        await this.csvLoaderManager.LoadData(count, true);
    }
}
