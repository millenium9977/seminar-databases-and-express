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


    constructor(private readonly _csvObjectFactory: CsvObjectFactory) {
    }

    private getRecordsFromCSV(): any[] {
        const filepath: string = `${path.join(__dirname, CsvLoaderManager.RELATIVE_DIRECTORY_PATH)}${CsvLoaderManager.FILENAME}`;
        const content: string = fs.readFileSync(filepath, 'utf8');
        return parse(content, {
            delimiter: ',',
            skip_lines_with_error: true,
            skip_empty_lines: true,
        });
    }

    private async insertRecord(record: any, relations: boolean) {
        try {
            await this._csvObjectFactory.CreateMovieMD(record, relations);
        } catch (err) {
            return;
        }
    }

    public async WithRelations(count: number) {
        const records: any[] = this.getRecordsFromCSV();
        const length = count > records.length ? records.length : count;
        for (let i = 0; i < length; i++) {
            await this.insertRecord(records[i], true);
        }
    }

    public async WithoutRelations(count: number) {
        const records: any[] = this.getRecordsFromCSV();
        const length = count > records.length ? records.length : count;
        for (let i = 0; i < length; i++) {
            await this.insertRecord(records[i], false);
        }
    }


}
