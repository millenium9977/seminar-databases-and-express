import {injectable}        from 'tsyringe';
import {Request, Response} from 'express';
import {MovieMdManager}    from '../../../logic/movieMd-manager';
import {CompanyManager}                 from '../../../logic/company-manager';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';
import Test = Mocha.Test;

@injectable()
export class UtilsController {

    constructor(private movieManager: MovieMdManager,
        private companyManager: CompanyManager) {
    }

    public async Movies(req: Request, res: Response) {
        const result: TestResult = await measurementHandler(async () => this.movieManager.Movies());
        res.status(200).send(result).end('ok');
    }

    public async Companies(req: Request, res: Response) {
        const result: TestResult = await measurementHandler(async () => this.companyManager.Companies());
        res.status(200).send(result).end('ok');
    }
}
