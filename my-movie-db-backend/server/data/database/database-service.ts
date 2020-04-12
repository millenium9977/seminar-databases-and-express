import mongoose from 'mongoose';
import logger from '../../common/logger';
import {singleton} from 'tsyringe';
import {CsvLoaderManager} from '../csv-loader/csv-loader-manager';
import {DEFAULT_SIZE} from '../../index';

@singleton()
export class DatabaseService {

    public Dirty: boolean = true;

    constructor(private csvLoaderManager: CsvLoaderManager) {
    }

    public async Setup(): Promise<boolean> {
        try {
            logger.debug('Try to connect to database');
            await mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});
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

    public async ResetNoRelations(count: number = DEFAULT_SIZE): Promise<void> {
        if(this.Dirty) {
            return;
        }

        await this.ResetDB();
        await this.csvLoaderManager.LoadData(count, false);

    }

    public async ResetWithRelations(count: number = DEFAULT_SIZE): Promise<void> {
        if(this.Dirty) {
            return;
        }

        await this.ResetDB();
        await this.csvLoaderManager.LoadData(count, true);

    }
}
