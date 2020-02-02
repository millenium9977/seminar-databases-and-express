import {injectable} from 'tsyringe';
import parse from 'csv-parse/lib/sync';
import fs from 'fs';
import logger from '../../common/logger';
import {CsvObjectFactory} from './csv-object-factory';
import * as path from 'path';
import {TimeMeasurementService} from '../../logic/time-measurement-service';
import ogmneo from "ogmneo/index.js";

@injectable()
export class CsvLoaderManager {

    private static readonly FILENAME                = '/movies_metadata.csv';
    private static readonly RELATIVE_DIRECTORY_PATH = '../../dataset';
    private LOG_DATABASE = true;

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
        for (let i = 0; i < records.length; i++) {
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
        if(this.LOG_DATABASE) {
            let genres = await ogmneo.Node.find(ogmneo.Query.create('genre'));
            logger.debug('Genres: ' + genres.length);
            let languages = await ogmneo.Node.find(ogmneo.Query.create('language'));
            logger.debug('Languages: ' + languages.length);
            let companies = await ogmneo.Node.find(ogmneo.Query.create('company'));
            logger.debug('Companies: ' + companies.length);
            let countries = await ogmneo.Node.find(ogmneo.Query.create('country'));
            logger.debug('Countries: ' + countries.length);
            let collections = await ogmneo.Node.find(ogmneo.Query.create('collection'));
            logger.debug('Collections: ' + collections.length);
            let movies = await ogmneo.Node.find(ogmneo.Query.create('movie'));
            logger.debug('Movies: ' + movies.length);
            let movToGen = await ogmneo.Relation.find(ogmneo.RelationQuery.create('mov_gen'));
            logger.debug('mov_gen: ' + movToGen.length);
            let movToLan = await ogmneo.Relation.find(ogmneo.RelationQuery.create('mov_lan'));
            logger.debug('mov_lan: ' + movToLan.length);
            let movToCom = await ogmneo.Relation.find(ogmneo.RelationQuery.create('mov_com'));
            logger.debug('mov_com: ' + movToCom.length);
            let comToMov = await ogmneo.Relation.find(ogmneo.RelationQuery.create('com_mov'));
            logger.debug('com_mov: ' + comToMov.length);
            let movToCou = await ogmneo.Relation.find(ogmneo.RelationQuery.create('mov_cou'));
            logger.debug('mov_cou: ' + movToCou.length);
            let movToCol = await ogmneo.Relation.find(ogmneo.RelationQuery.create('mov_col'));
            logger.debug('mov_col: ' + movToCol.length);
            let colToMov = await ogmneo.Relation.find(ogmneo.RelationQuery.create('col_mov'));
            logger.debug('col_mov: ' + colToMov.length);
        }
    }

}
