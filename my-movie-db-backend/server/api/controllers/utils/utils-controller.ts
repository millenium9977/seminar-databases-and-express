import {Request, Response}              from 'express';
import {MovieManager}                   from '../../../logic/movie-manager';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';
import {injectable}                     from 'tsyringe';
import Test = Mocha.Test;
import {CompanyManager}                 from '../../../logic/company-manager';

@injectable()
export class UtilsController {

    constructor(private movieManager: MovieManager,
        private companyManager: CompanyManager) {
    }

    public async MoviesByWord(req: Request, res: Response): Promise<void> {
        const word: string = req.params.word;

        const result: TestResult = await measurementHandler(async () => await this.movieManager.FilterWithWord(word));

        res.status(200).send(result).end('ok');
    }

    public async Companies(req: Request, res: Response): Promise<void> {
        const result: TestResult = await measurementHandler(async () => await this.companyManager.Companies());

        res.status(200).send(result).end('ok');
    }

    public async Movies(req: Request, res: Response): Promise<void> {
        const result: TestResult = await measurementHandler(async () => await this.movieManager.Movies());

        res.status(200).send(result).end('ok');
    }
}
