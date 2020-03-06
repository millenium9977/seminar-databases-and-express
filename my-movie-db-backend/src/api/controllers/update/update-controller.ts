import {Request, Response} from 'express';
import {injectable} from 'tsyringe';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';
import {MovieManager} from '../../../logic/movie-manager';
import {RepositoryService} from '../../../data/database/repository-service';

@injectable()
export class UpdateController {

    constructor(private _movieManager: MovieManager,
                private _repositoryService: RepositoryService) {
    }

    public async Replace(req: Request, res: Response) {
        const char: string = req.params.char;
        const word: string = req.params.word;
        let result: TestResult;
        await this._repositoryService.ResetDatabase();
        result = await measurementHandler(async () =>
            await this._movieManager.ReplaceCharInMovieTitle(char, word)
        );
        res.status(200).send(result).end('ok');
    }
}