import {injectable} from 'tsyringe';
import {Request, Response} from 'express';
import {MovieManager} from '../../../logic/movie-manager';
import {RepositoryService} from '../../../data/database/repository-service';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';
import {CompanyManager} from '../../../logic/company-manager';

@injectable()
export class SearchController {

    constructor(private _movieManager: MovieManager,
        private repositoryService: RepositoryService,
        private companyManager: CompanyManager) {
    }

    public async AllMoviesWith(req: Request, res: Response) {
        const word: string = req.params.word;
        let result: TestResult;
        await this.repositoryService.ResetDatabaseWithoutRelations(1000);
        result = await measurementHandler(async () =>
            await this._movieManager.FilterWithWord(word),
        );

        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithLang(req: Request, res: Response) {
        const lang = req.params.lang;
        let result: TestResult;

        await this.repositoryService.ResetDatabaseWithRelations(1000);
        result = await measurementHandler(async () =>
            await this._movieManager.FilterWithLang(lang),
        );

        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithGenre(req: Request, res: Response) {
        const genre: string = req.params.genre;
        let result: TestResult;

        await this.repositoryService.ResetDatabaseWithRelations(1000);
        result = await measurementHandler(async () =>
            await this._movieManager.FilterWithGenre(genre));

        res.status(200).send(result).end('ok');
    }

    public async AllCompaniesWithMovieLang(req: Request, res: Response) {
        const lang: string = req.params.lang;

        await this.repositoryService.ResetDatabaseWithRelations();
        const result: TestResult = await measurementHandler(async () =>
            await this.companyManager.CompaniesByLang(lang));

        res.status(200).send(result).end('ok');
    }

    public async GetCompanyMoviesBudget(req: Request, res: Response) {
        const name: string = req.params.name;

        await this.repositoryService.ResetDatabaseWithRelations(1000);
        const result: TestResult = await measurementHandler(
            async () => await this.companyManager.MoviesBudget(name));

        res.status(200).send(result).end('ok');
    }
}
