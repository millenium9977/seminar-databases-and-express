import {injectable}             from 'tsyringe';
import parse                    from 'csv-parse/lib/sync';
import fs                       from 'fs';
import logger                   from '../../common/logger';
import {CsvObjectFactory}       from './csv-object-factory';
import * as path                from 'path';
import {TimeMeasurementService} from '../../logic/time-measurement-service';

@injectable()
export class CsvLoaderManager {
    private static readonly FILENAME                = '/movies_metadata.csv';
    private static readonly RELATIVE_DIRECTORY_PATH = '../../dataset';


    constructor(private readonly _csvObjectFactory: CsvObjectFactory,
        private readonly _timeMeasurementService: TimeMeasurementService) {
    }

    public async LoadCSV() {

        const filepath: string = `${path.join(__dirname, CsvLoaderManager.RELATIVE_DIRECTORY_PATH)}${CsvLoaderManager.FILENAME}`;
        logger.debug(`Loading csv from: ${filepath}`);
        const content: string = fs.readFileSync(filepath, 'utf8');
        const records: any[]  = parse(content, {
            delimiter: ',',
            skip_lines_with_error: true,
            skip_empty_lines: true,
        });


        this._timeMeasurementService.Start();
        for (let i = 0; i < 500; i++) {
            let r = records[i];
            try {
                await this._csvObjectFactory.CreateMovieMD(r);
            } catch (err) {
                logger.debug('The csv loader catched it');
                logger.error(err);
            }
        }
        this._timeMeasurementService.Stop();
        logger.info('Finished inserting records');
        logger.info(`Time needed for insertion: ${this._timeMeasurementService.Result}`);
    }

    // private LoadFile(error: NodeJS.ErrnoException | null, data: Buffer): void {
    //     if (error) {
    //         return logger.error(error);
    //     }
    // }
}
