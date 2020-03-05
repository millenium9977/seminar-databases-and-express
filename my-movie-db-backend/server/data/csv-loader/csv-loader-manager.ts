import {injectable}         from 'tsyringe';
import parse                from 'csv-parse/lib/sync';
import fs                   from 'fs';
import logger               from '../../common/logger';
import {CsvObjectFactory}   from './csv-object-factory';
import * as path            from 'path';
import {ICompany}           from '../schemas/company-schema';
import {ICollection}        from '../schemas/collection-schema';

@injectable()
export class CsvLoaderManager {
    private static readonly FILENAME                = '/movies_metadata.csv';
    private static readonly RELATIVE_DIRECTORY_PATH = '../../dataset';


    constructor(private readonly csvObjectFactory: CsvObjectFactory) {
    }

    private async insertRecord(record: any, relations: boolean): Promise<void> {
        try {
            await this.csvObjectFactory.CreateMovieMD(record, relations);
        } catch (err) {
            return ;
        }
    }

    public async LoadData(count: number = 100, relations: boolean = true): Promise<void> {
        const records : any[] = this.getRecords();
        const length = count > records.length ? records.length : count;

        if(relations) {
            await this.preloadRelations(records, length);
        }

        for (let i = 0; i < length; i++) {
            await this.insertRecord(records[i], relations);
        }
    }

    private getRecords(): any[] {
        const filepath: string = `${path.join(__dirname, CsvLoaderManager.RELATIVE_DIRECTORY_PATH)}${CsvLoaderManager.FILENAME}`;
        logger.debug(`Loading csv from: ${filepath}`);
        const content: string = fs.readFileSync(filepath, 'utf8');
        return parse(content, {
            delimiter: ',',
            skip_lines_with_error: true,
            skip_empty_lines: true,
        });
    }

    private async preloadRelations(records: any[], length): Promise<void> {
        const collectionMap: Map<String, ICollection> = new Map<String, ICollection>();
        const companyMap: Map<String, ICompany>       = new Map<String, ICompany>();
        for (let i = 0; i < length; i++) {
            let r                         = records[i];
            const companies: ICompany[]   = this.csvObjectFactory.GetCompanies(r);
            const collection: ICollection = this.csvObjectFactory.GetCollection(r);

            if (collection && !collectionMap.has(collection.Name)) {
                collectionMap.set(collection.Name, collection);
            }

            for (const company of companies) {
                if (!companyMap.has(company.Name)) {
                    companyMap.set(company.Name, company);
                }
            }
        }

        for (const company of companyMap.values()) {
            await company.save();
        }

        for (const collection of collectionMap.values()) {
            await collection.save();
        }
    }
}
