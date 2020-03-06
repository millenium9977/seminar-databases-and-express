import {injectable} from 'tsyringe';
import parse from 'csv-parse/lib/sync';
import fs from 'fs';
import logger from '../../common/logger';
import {CsvObjectFactory} from './csv-object-factory';
import * as path from 'path';
import {measurementHandler} from '../../logic/time-measurement-service';
import ogmneo from "ogmneo/index.js";
import {Movie} from "../../cross-cutting/data_classes/movie";
import {CompanyManager} from '../../logic/company-manager';
import {MovieManager} from '../../logic/movie-manager';

@injectable()
export class CsvLoaderManager {

    private static readonly FILENAME                = '/movies_metadata.csv';
    private static readonly RELATIVE_DIRECTORY_PATH = '../../dataset';
    private LOG_DATABASE = false;
    private static records = null;

    constructor(private readonly _csvObjectFactory: CsvObjectFactory,
                private readonly _movieManager: MovieManager,
                private readonly _companyManager: CompanyManager) {
    }

    public LoadCSV(): any[] {
        if(CsvLoaderManager.records != null) {
            return CsvLoaderManager.records;
        }
        const filepath: string = `${path.join(__dirname, CsvLoaderManager.RELATIVE_DIRECTORY_PATH)}${CsvLoaderManager.FILENAME}`;
        logger.debug(`Loading csv from: ${filepath}`);
        const content: string = fs.readFileSync(filepath, 'utf8');
        const records: any[] = parse(content, {
            delimiter: ',',
            skip_lines_with_error: true,
            skip_empty_lines: true,
        });
        CsvLoaderManager.records = records;
        return records;
    }

    public async Init(count: number) {
        const records: any[] = this.LoadCSV();
        const length = count > records.length ? records.length : count;
        for (let i = 0; i < length; i++) {
            let r = records[i];
            try {
                await this._csvObjectFactory.CreateMovieMD(r);
            } catch (err) {
                logger.error(err);
            }
        }
    }

        /*for (let i = 0; i < 0 // juhu hier ist nicht 0
            ; i++) {
            let r = records[i];
            try {
                await this._csvObjectFactory.CreateMovieMD(r);
            } catch (err) {
                logger.debug('The csv loader catched it');
                logger.error(err);
            }
        }*/

        /*let result = await measurementHandler(async () => {
            logger.warn((await this._movieManager.ReplaceCharInMovieTitle('TOY', 'Toy')).length + '');
        });
        logger.warn(result.Time);*/

        /*let result2 = await measurementHandler(async () => {
            await this._companyManager.GetCompanyByMovieByLanguageByCodeCypher('de');
        });
        logger.warn(result2.Time);

        let result3 = await measurementHandler(async () => {
            await this._companyManager.GetCompanyByMovieByLanguageByCode('de');
        });
        logger.warn(result3.Time);*/


    public async LogDetails() {
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
