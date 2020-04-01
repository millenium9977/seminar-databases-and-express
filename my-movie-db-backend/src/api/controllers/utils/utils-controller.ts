
import {Request, Response} from 'express';
import {MovieManager} from '../../../logic/movie-manager';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';
import {injectable} from 'tsyringe';
import {CompanyManager} from "../../../logic/company-manager";

@injectable()
export class UtilsController {

    constructor(
        private _movieManager: MovieManager,
        private _companyManager: CompanyManager
    ) {
    }

    public async MoviesContain(req: Request, res: Response): Promise<void> {
        const word: string = req.params.word;
        const result: TestResult = await measurementHandler(async () =>
            await this._movieManager.GetMoviesByContainingValue(word)
        );
        res.status(200).send(result).end('ok');
    }

    public async Companies(req: Request, res: Response): Promise<void> {
        const result: TestResult = await measurementHandler(
            async () => await this._companyManager.Companies()
        );

        res.status(200).send(result).end('ok');
    }

    public async Movies(req: Request, res: Response): Promise<void> {
        const result: TestResult = await measurementHandler(
            async () => await this._movieManager.Movies()
        );

        res.status(200).send(result).end('ok');
    }
}
