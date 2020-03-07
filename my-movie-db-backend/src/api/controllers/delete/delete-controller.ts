import {injectable} from 'tsyringe';
import {Request, Response} from 'express';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';
import {MovieManager} from '../../../logic/movie-manager';
import {RepositoryService} from '../../../data/database/repository-service';
import {CompanyManager} from '../../../logic/company-manager';

@injectable()
export class DeleteController {

    constructor(private _movieManager: MovieManager,
                private _companyManager: CompanyManager,
                private _repositoryService: RepositoryService) {
    }

    public async AllMoviesContain(req: Request, res: Response) {
        const word: string = req.params.word;
        let result: TestResult;
        await this._repositoryService.ResetDatabase();
        result = await measurementHandler(async () =>
            await this._movieManager.DeleteMoviesByContainingValue(word)
        );

        this._repositoryService.Dirty = true;

        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithLang(req: Request, res: Response) {
        const lang: string = req.params.lang;
        let result: TestResult;
        await this._repositoryService.ResetDatabase();
        result = await measurementHandler(async () =>
            await this._movieManager.DeleteMoviesByLanguageByNameCypher(lang)
        );

        this._repositoryService.Dirty = true;

        res.status(200).send(result).end('ok');
    }

    public async AllMoviesWithGenre(req: Request, res: Response) {
        const genre: string = req.params.genre;
        let result: TestResult;
        await this._repositoryService.ResetDatabase();
        result = await measurementHandler(async () =>
            await this._movieManager.DeleteMoviesByGenreByNameCypher(genre)
        );

        this._repositoryService.Dirty = true;

        res.status(200).send(result).end('ok');
    }

    public async AllCompaniesByMovieByLanguage(req: Request, res: Response) {
        const language: string = req.params.lang;
        let result: TestResult;
        await this._repositoryService.ResetDatabase();
        result = await measurementHandler(async () =>
            await this._companyManager.DeleteCompanyByMovieByLanguageByCodeCypher(language)
        );

        this._repositoryService.Dirty = true;

        res.status(200).send(result).end('ok');
    }

}
