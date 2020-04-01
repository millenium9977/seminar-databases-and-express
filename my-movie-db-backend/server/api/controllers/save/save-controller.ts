import {injectable}         from 'tsyringe';
import {Request, Response}  from 'express';
import {DatabaseService}    from '../../../data/database/database-service';
import {CsvLoaderManager}               from '../../../data/csv-loader/csv-loader-manager';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';

@injectable()
export class SaveController {

    constructor(private databaseService: DatabaseService,
        private csvLoaderManager: CsvLoaderManager) {
    }

    public async WithRelations(req: Request, res: Response) {
        const count: number = parseInt(req.params.count);

        await this.databaseService.ResetDB();
        const result: TestResult = await measurementHandler(async () => this.csvLoaderManager.LoadData(count, true));

        this.databaseService.Dirty = true;

        res.status(200).send(result).end('ok');
    }

    public async NoRelations(req: Request, res: Response) {
        const count: number = parseInt(req.params.count);

        await this.databaseService.ResetDB();
        const result: TestResult = await measurementHandler(async () => this.csvLoaderManager.LoadData(count, false));

        this.databaseService.Dirty = true;

        res.status(200).send(result).end('ok');
    }

}
