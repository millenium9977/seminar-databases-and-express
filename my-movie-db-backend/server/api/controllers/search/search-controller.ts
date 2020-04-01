import {injectable}                     from 'tsyringe';
import {MovieMdManager}                 from '../../../logic/movieMd-manager';
import {Request, Response}              from 'express';
import {DatabaseService}                from '../../../data/database/database-service';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';
import {CompanyManager}                 from '../../../logic/company-manager';

@injectable()
export class SearchController {

    constructor(private movieMdManager: MovieMdManager,
        private databaseService: DatabaseService,
        private companyManger: CompanyManager) {
    }

    public async AllMovies(req: Request, res: Response) {
        const word: string = req.params.word;

        await this.databaseService.ResetNoRelations();

        const result: TestResult = await measurementHandler(async () =>
            await this.movieMdManager.FilterWithWord(word));

        this.databaseService.Dirty = true;

        res.status(200)
            .send(result)
            .end('ok');
    }

    public async MoviesWithLang(req: Request, res: Response) {
        const lang: string = req.params.lang;

        await this.databaseService.ResetWithRelations();

        const result: TestResult = await measurementHandler(async () =>
            await this.movieMdManager.FilterWithLang(lang));

        res.status(200)
            .send(result)
            .end('ok');
    }

    public async MovesWithGenre(req: Request, res: Response) {
        const genre: string = req.params.genre;

        await this.databaseService.ResetWithRelations();

        const result: TestResult = await measurementHandler(async () =>
            await this.movieMdManager.FilterWithGenre(genre));

        res.status(200)
            .send(result)
            .end('ok');
    }

    public async CompaniesByLang(req: Request, res: Response) {
        const lang: string = req.params.lang;

        await this.databaseService.ResetWithRelations();

        const result: TestResult = await measurementHandler(async () =>
            await this.companyManger.FilterByMovieLang(lang));

        res.status(200).send(result).end('ok');
    }

    public async GetCompanyMoviesBudget(req: Request, res: Response) {
        const name: string = req.params.name;

        await this.databaseService.ResetWithRelations();

        const result: TestResult = await measurementHandler(async () =>
            await this.companyManger.MoviesBudget(name));

        res.status(200).send(result).end('ok');
    }
}
