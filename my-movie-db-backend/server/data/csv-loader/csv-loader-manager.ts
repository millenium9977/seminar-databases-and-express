import {injectable} from "tsyringe";
import parse from 'csv-parse/lib/sync'
import fs from 'fs';
import logger from "../../common/logger";
import {CsvObjectFactory} from "./csv-object-factory";
import {MovieMdManager} from "../../logic/movieMd-manager";
import MovieMetadata from "../../cross-cutting/data_classes/movie-metadata";

@injectable()
export class CsvLoaderManager {
    private static readonly FILENAME = '/movies_metadata.csv';

    private readonly _csvObjectFactory: CsvObjectFactory;
    private readonly _movieMdManager: MovieMdManager;

    constructor(csvObjectFactory: CsvObjectFactory,
                movieMdManager: MovieMdManager) {
        this._csvObjectFactory = csvObjectFactory;
        this._movieMdManager = movieMdManager;
    }

    public LoadCSV() {
        const content: string = fs.readFileSync(`${process.env.DATASET_FILEPATH}${CsvLoaderManager.FILENAME}`, 'utf8');
        const records: any[] = parse(content, {
            delimiter: ',',
            skip_lines_with_error: true,
            skip_empty_lines: true,
        });

        records.forEach((r) => {
            this._csvObjectFactory.CreateMovieMD(r);
        })

        const movie : MovieMetadata = this._movieMdManager.GetMovieByTitle('Toy Story');
        logger.debug(movie)
    }

    // private LoadFile(error: NodeJS.ErrnoException | null, data: Buffer): void {
    //     if (error) {
    //         return logger.error(error);
    //     }
    // }
}