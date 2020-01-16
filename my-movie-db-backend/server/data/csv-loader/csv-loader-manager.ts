import {injectable} from "tsyringe";
import parse from 'csv-parse/lib/sync'
import fs from 'fs';
import logger from "../../common/logger";
import {CsvObjectFactory} from "./csv-object-factory";

@injectable()
export class CsvLoaderManager {
    private static readonly FILENAME = '/movies_metadata.csv';

    private readonly _csvObjectFactory: CsvObjectFactory;

    constructor(csvObjectFactory: CsvObjectFactory) {
        this._csvObjectFactory = csvObjectFactory;
    }

    public LoadCSV() {
        const content: string = fs.readFileSync(`${process.env.DATASET_FILEPATH}${CsvLoaderManager.FILENAME}`, 'utf8');
        const records: any[] = parse(content, {
            delimiter: ',',
            skip_lines_with_error: true,
            skip_empty_lines: true,
        })

        const record = records[1];

        logger.debug(record);
    }

    // private LoadFile(error: NodeJS.ErrnoException | null, data: Buffer): void {
    //     if (error) {
    //         return logger.error(error);
    //     }
    // }
}