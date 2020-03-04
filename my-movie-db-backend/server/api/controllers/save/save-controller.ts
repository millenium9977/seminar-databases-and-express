import {container, injectable}                      from 'tsyringe';
import {Request, Response}                          from 'express';
import {RepositoryService}                                      from '../../../data/database/repository-service';
import {measurementHandler, TestResult, TimeMeasurementService} from '../../../logic/time-measurement-service';
import logger                                                   from '../../../common/logger';
import {CsvLoaderManager}                           from '../../../data/csv-loader/csv-loader-manager';
import Test = Mocha.Test;


@injectable()
export class SaveController {

    constructor(private _repositoryService: RepositoryService,
        private _csvLoaderManager: CsvLoaderManager) {
    }

    public async SaveWithRelations(req: Request, res: Response) {

        let count: number;
        try {
            count = Number.parseInt(req.params.count);
        } catch (err) {
            logger.error(err);
            res.status(500).send().end('error');
            return;
        }

        if (!count || count == 0) {
            res.status(400).send().end('error');
            return;
        }



        let result: TestResult;
        try {
            await this._repositoryService.ResetDatabase();
            result = await measurementHandler(async () => {
                await this._csvLoaderManager.WithRelations(count);
            });
        } catch (err) {
            res.status(500).send().end('error');
            return;
        }

        res.status(200).send(result).end('ok');
    }

    public async SaveNoRelations(req: Request, res: Response) {
        const count: number = Number.parseInt(req.params.count);

        await this._repositoryService.ResetDatabase();
        const result: TestResult  = await measurementHandler(async () => {
            await this._csvLoaderManager.WithoutRelations(count);
        });

        res.status(200).send(result).end('ok');
    }
}
