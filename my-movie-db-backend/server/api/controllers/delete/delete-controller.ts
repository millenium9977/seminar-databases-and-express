import {injectable}                     from 'tsyringe';
import {Request, Response}              from 'express';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';
import {MovieManager}                   from '../../../logic/movie-manager';
import {RepositoryService}              from '../../../data/database/repository-service';
import {CompanyManager}                 from '../../../logic/company-manager';

@injectable()
export class DeleteController {

    constructor(private movieManager: MovieManager,
        private repositoryService: RepositoryService,
        private companyManager: CompanyManager) {
    }

    public async AllMoviesWith(req: Request, res: Response) {
        const word: string = req.params.word;
        let result: TestResult;

        await this.repositoryService.ResetDatabaseWithoutRelations(100);
        result = await measurementHandler(async () =>
            await this.movieManager.DeleteWithWord(word));

        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithLang(req: Request, res: Response) {
        const lang: string = req.params.lang;
        let result: TestResult;

        await this.repositoryService.ResetDatabaseWithRelations(100);
        result = await measurementHandler(async () => await this.movieManager.DeleteWithLang(lang));

        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithGenre(req: Request, res: Response) {
        const genre: string = req.params.genre;
        let result: TestResult;

        await this.repositoryService.ResetDatabaseWithRelations(100);
        result = await measurementHandler(async () => await this.movieManager.DeleteWithGenre(genre));

        res.status(200).send(result).end('ok');
    }

    public async CompaniesByLang(req: Request, res: Response) {
        const lang: string = req.params.lang;

        await this.repositoryService.ResetDatabaseWithRelations(100);
        const result: TestResult = await measurementHandler(async () => await this.companyManager.DeleteByMovieLang(lang));
        res.status(200).send().end('ok');
    }
}
