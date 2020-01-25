import {injectable} from "tsyringe";
import parse from 'csv-parse/lib/sync'
import fs from 'fs';
import logger from "../../common/logger";
import {CsvObjectFactory} from "./csv-object-factory";
import {MovieMdManager} from "../../logic/movieMd-manager";
import MovieMetadata from "../../cross-cutting/data_classes/movie-metadata";
import * as path from "path";

@injectable()
export class CsvLoaderManager {
    private static readonly FILENAME = '/movies_metadata.csv';
    private static readonly RELATIVE_DIRECTORY_PATH = '../../dataset';

    private readonly _csvObjectFactory: CsvObjectFactory;
    private readonly _movieMdManager: MovieMdManager;

    constructor(csvObjectFactory: CsvObjectFactory,
                movieMdManager: MovieMdManager) {
        this._csvObjectFactory = csvObjectFactory;
        this._movieMdManager = movieMdManager;
    }

    public LoadCSV() {

        const filepath : string = `${path.join(__dirname, CsvLoaderManager.RELATIVE_DIRECTORY_PATH)}${CsvLoaderManager.FILENAME}`;
        logger.debug(`Loading csv from: ${filepath}`);
        const content: string = fs.readFileSync(filepath, 'utf8');
        const records: any[] = parse(content, {
            delimiter: ',',
            skip_lines_with_error: true,
            skip_empty_lines: true,
        });

        records.forEach((r) => {
            this._csvObjectFactory.CreateMovieMD(r);
        });
    }

    // private LoadFile(error: NodeJS.ErrnoException | null, data: Buffer): void {
    //     if (error) {
    //         return logger.error(error);
    //     }
    // }
}
