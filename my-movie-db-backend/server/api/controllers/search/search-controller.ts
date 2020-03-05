import {injectable}                     from 'tsyringe';
import {Request, Response}              from 'express';
import {MovieManager}                   from '../../../logic/movie-manager';
import {RepositoryService}              from '../../../data/database/repository-service';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';
import {CompanyManager}                 from '../../../logic/company-manager';

@injectable()
export class SearchController {

    constructor(private _movieManager: MovieManager,
        private _repositoryService: RepositoryService,
        private _companyManager: CompanyManager) {
    }

    public async AllMoviesWith(req: Request, res: Response) {
        const word: string = req.params.word;
        let result: TestResult;
        await this._repositoryService.ResetDatabaseWithoutRelations(100);
        result = await measurementHandler(async () =>
            await this._movieManager.FilterWithWord(word),
        );

        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithLang(req: Request, res: Response) {
        const lang = req.params.lang;
        let result: TestResult;

        await this._repositoryService.ResetDatabaseWithRelations(100);
        result = await measurementHandler(async () =>
            await this._movieManager.FilterWithLang(lang),
        );

        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithGenre(req: Request, res: Response) {
        const genre: string = req.params.genre;
        let result: TestResult;

        await this._repositoryService.ResetDatabaseWithRelations(100);
        result = await measurementHandler(async () =>
            await this._movieManager.FilterWithGenre(genre));

        res.status(200).send(result).end('ok');
    }

    public async GetCompanyMoviesBudget(req: Request, res: Response) {
        const name: string = req.params.name;

        await this._repositoryService.ResetDatabaseWithRelations(100);
        const result: TestResult = await measurementHandler(
            async () => await this._companyManager.MoviesBudget(name));

        res.status(200).send(result).end('ok');
    }
}
