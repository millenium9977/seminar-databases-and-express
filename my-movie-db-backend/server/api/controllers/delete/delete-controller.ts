import {injectable}                     from 'tsyringe';
import {Request, Response}                        from 'express';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';
import {MovieManager}                   from '../../../logic/movie-manager';
import {RepositoryService}              from '../../../data/database/repository-service';

@injectable()
export class DeleteController {

    constructor(private _movieManager: MovieManager,
        private _repositoryService: RepositoryService) {
    }

    public async AllMoviesWith(req: Request, res: Response) {
        const word: string = req.params.word;
        let result: TestResult;

        await this._repositoryService.ResetDatabaseWithoutRelations(100);
        result = await measurementHandler(async () =>
            await this._movieManager.DeleteWithWord(word));

        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithLang(req: Request, res: Response) {
        const lang: string = req.params.lang;
        let result: TestResult;

        await this._repositoryService.ResetDatabaseWithRelations(100);
        result = await measurementHandler(async () => await this._movieManager.DeleteWithLang(lang));

        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithGenre(req: Request, res: Response) {
        const genre: string = req.params.genre;
        let result: TestResult;

        await this._repositoryService.ResetDatabaseWithRelations(100);
        result = await measurementHandler(async () => await this._movieManager.DeleteWithGenre(genre));

        res.status(200).send(result).end('ok');
    }


}