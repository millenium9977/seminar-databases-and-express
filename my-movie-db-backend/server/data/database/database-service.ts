import mongoose, {Connection} from 'mongoose';
import logger                 from '../../common/logger';
import {injectable}           from 'tsyringe';

@injectable()
export class DatabaseService {
    public async Setup(): Promise<void> {
        try {
            logger.debug('Try to connect to database');
            await mongoose.connect('mongodb://localhost/moviedb', {useNewUrlParser: true,  useUnifiedTopology: true});
            logger.debug('Seem\'s like we got it!');
        } catch (error) {
            logger.error(error);
        }
    }
}