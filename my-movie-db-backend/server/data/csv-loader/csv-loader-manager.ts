import {injectable}       from 'tsyringe';
import parse              from 'csv-parse/lib/sync';
import fs                 from 'fs';
import logger             from '../../common/logger';
import {CsvObjectFactory} from './csv-object-factory';
import * as path          from 'path';

@injectable()
export class CsvLoaderManager {
    private static readonly FILENAME                = '/movies_metadata.csv';
    private static readonly RELATIVE_DIRECTORY_PATH = '../../dataset';


    constructor(private readonly _csvObjectFactory: CsvObjectFactory) {
    }

    public LoadCSV() {

        const filepath: string = `${path.join(__dirname, CsvLoaderManager.RELATIVE_DIRECTORY_PATH)}${CsvLoaderManager.FILENAME}`;
        logger.debug(`Loading csv from: ${filepath}`);
        const content: string = fs.readFileSync(filepath, 'utf8');
        const records: any[]  = parse(content, {
            delimiter: ',',
            skip_lines_with_error: true,
            skip_empty_lines: true,
        });

        for (const r of records) {
            this._csvObjectFactory.CreateMovieMD(r);
        }
    }
}


// private LoadFile(error: NodeJS.ErrnoException | null, data: Buffer): void {
//     if (error) {
//         return logger.error(error);
//     }
// }