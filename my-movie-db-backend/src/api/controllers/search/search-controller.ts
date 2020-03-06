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

    public async AllMoviesStartWith(req: Request, res: Response) {
        const word: string = req.params.word;
        let result: TestResult;
        await this.repositoryService.ResetDatabase();
        result = await measurementHandler(async () =>
            await this._movieManager.GetMoviesByStartValue(word),
        );
        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithLang(req: Request, res: Response) {
        const lang = req.params.lang;
        let result: TestResult;
        await this.repositoryService.ResetDatabase();
        result = await measurementHandler(async () =>
            await this._movieManager.GetMoviesByLanguageByName(lang),
        );
        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithGenre(req: Request, res: Response) {
        const genre: string = req.params.genre;
        let result: TestResult;
        await this.repositoryService.ResetDatabase();
        result = await measurementHandler(async () =>
            await this._movieManager.GetMoviesByGenreByName(genre)
        );
        res.status(200).send(result).end('ok');
    }

    public async AllCompaniesWithMovieLang(req: Request, res: Response) {
        const lang: string = req.params.lang;
        await this.repositoryService.ResetDatabase();
        const result: TestResult = await measurementHandler(async () =>
            await this.companyManager.GetCompanyByMovieByLanguageByCodeCypher(lang)
        );
        res.status(200).send(result).end('ok');
    }

    public async GetCompanyMoviesBudget(req: Request, res: Response) {
        const name: string = req.params.name;
        await this.repositoryService.ResetDatabase();
        const result: TestResult = await measurementHandler(
            async () => await this.companyManager.GetBudgetByCompanyName(name)
        );
        res.status(200).send(result).end('ok');
    }
}