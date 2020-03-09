import {injectable} from 'tsyringe';
import {Request, Response} from 'express';
import {RepositoryService} from '../../../data/database/repository-service';
import {measurementHandler, TestResult, TimeMeasurementService} from '../../../logic/time-measurement-service';
import {CsvLoaderManager} from '../../../data/csv-loader/csv-loader-manager';
import logger from "../../../common/logger";

@injectable()
export class SaveController {

    constructor(private _repositoryService: RepositoryService,
                private _csvLoaderManager: CsvLoaderManager) {
    }

    public async SaveWithRelationships(req: Request, res: Response) {
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
        await this._repositoryService.ResetDatabase(-1);
        const result: TestResult  = await measurementHandler(async () => {
            await this._csvLoaderManager.InitWithRelationships(count);
        });
        res.status(200).send(result).end('ok');
    }

    public async Save(req: Request, res: Response) {
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
        await this._repositoryService.ResetDatabase(-1);
        const result: TestResult  = await measurementHandler(async () => {
            await this._csvLoaderManager.Init(count);
        });
        res.status(200).send(result).end('ok');
    }

}