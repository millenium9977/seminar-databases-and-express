import {injectable} from 'tsyringe';
import parse from 'csv-parse/lib/sync';
import fs from 'fs';
import logger from '../../common/logger';
import {CsvObjectFactory} from './csv-object-factory';
import * as path from 'path';
import {ICompany} from '../schemas/company-schema';
import {CompanyManager} from '../../logic/company-manager';
import {ICollection} from '../schemas/collection-schema';
import {PerformanceManager} from '../../logic/performance-manager';

@injectable()
export class CsvLoaderManager {
    private static readonly FILENAME = '/movies_metadata.csv';
    private static readonly RELATIVE_DIRECTORY_PATH = '../../dataset';


    constructor(private readonly _csvObjectFactory: CsvObjectFactory, private readonly _performanceManager: PerformanceManager) {
    }

    public async LoadCSV() {

        const filepath: string = `${path.join(__dirname, CsvLoaderManager.RELATIVE_DIRECTORY_PATH)}${CsvLoaderManager.FILENAME}`;
        logger.debug(`Loading csv from: ${filepath}`);
        const content: string = fs.readFileSync(filepath, 'utf8');
        const records: any[] = parse(content, {
            delimiter: ',',
            skip_lines_with_error: true,
            skip_empty_lines: true,
        });


        const collectionMap: Map<String, ICollection> = new Map<String, ICollection>();
        const companyMap: Map<String, ICompany> = new Map<String, ICompany>();
        for (let i = 0; i < records.length; i++) {
            let r = records[i];
            const companies: ICompany[] = this._csvObjectFactory.GetCompanies(r);
            const collection: ICollection = this._csvObjectFactory.GetCollection(r);

            if(collection && !collectionMap.has(collection.Name)) {
                collectionMap.set(collection.Name, collection);
            }

            for (const company of companies) {
                if (!companyMap.has(company.Name)) {
                    companyMap.set(company.Name, company);
                }
            }
        }


        this._performanceManager.Start();

        for (const company of companyMap.values()) {
            await company.save();
        }

        for(const collection of collectionMap.values()) {
            await collection.save();
        }


        for (let i = 0; i < records.length; i++) {
            let r = records[i];
            await this._csvObjectFactory.CreateMovieMD(r);
        }

        this._performanceManager.Stop();
    }
}


// private LoadFile(error: NodeJS.ErrnoException | null, data: Buffer): void {
//     if (error) {
//         return logger.error(error);
//     }
// }
