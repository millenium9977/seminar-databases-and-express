
import {Request, Response} from 'express';
import {MovieManager} from '../../../logic/movie-manager';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';
import {injectable} from 'tsyringe';

@injectable()
export class UtilsController {

    constructor(private _movieManager: MovieManager) {
    }

    public async MoviesStartWith(req: Request, res: Response): Promise<void> {
        const word: string = req.params.word;
        const result: TestResult = await measurementHandler(async () =>
            await this._movieManager.GetMoviesByStartValue(word)
        );
        res.status(200).send(result).end('ok');
    }
}