import {injectable} from 'tsyringe';
import {Request, Response} from 'express';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';
import {MovieManager} from '../../../logic/movie-manager';
import {RepositoryService} from '../../../data/database/repository-service';

@injectable()
export class DeleteController {

    constructor(private _movieManager: MovieManager,
                private _repositoryService: RepositoryService) {
    }

    public async AllMoviesStartWith(req: Request, res: Response) {
        const word: string = req.params.word;
        let result: TestResult;
        await this._repositoryService.ResetDatabase();
        result = await measurementHandler(async () =>
            await this._movieManager.DeleteMoviesByStartValue(word)
        );
        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithLang(req: Request, res: Response) {
        const lang: string = req.params.lang;
        let result: TestResult;
        await this._repositoryService.ResetDatabase();
        result = await measurementHandler(async () =>
            await this._movieManager.DeleteMoviesByLanguageByNameCypher(lang)
        );
        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithGenre(req: Request, res: Response) {
        const genre: string = req.params.genre;
        let result: TestResult;
        await this._repositoryService.ResetDatabase();
        result = await measurementHandler(async () =>
            await this._movieManager.DeleteMoviesByGenreByNameCypher(genre)
        );
        res.status(200).send(result).end('ok');
    }


}