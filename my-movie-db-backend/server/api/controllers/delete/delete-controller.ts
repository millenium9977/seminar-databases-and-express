import {injectable}                     from 'tsyringe';
import {MovieMdManager}                 from '../../../logic/movieMd-manager';
import {DatabaseService}                from '../../../data/database/database-service';
import {Request, Response}              from 'express';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';
import {CompanyManager}                 from '../../../logic/company-manager';

@injectable()
export class DeleteController {

    constructor(private movieManager: MovieMdManager,
        private databaseService: DatabaseService,
        private companyManager: CompanyManager) {
    }

    public async Movies(req: Request, res: Response) {
        const word: string = req.params.word;

        await this.databaseService.ResetNoRelations();
        const result: TestResult = await measurementHandler(async () =>
            this.movieManager.DeleteWithWord(word));

        this.databaseService.Dirty =true;

        res.status(200).send(result).end('ok');
    }

    public async MoviesByLang(req: Request, res: Response) {
        const lang: string = req.params.lang;

        await this.databaseService.ResetWithRelations();
        const result: TestResult = await measurementHandler(async () =>
            this.movieManager.DeleteWithLang(lang));

        this.databaseService.Dirty =true;

        res.status(200).send(result).end('ok');
    }

    public async MoviesByGenre(req: Request, res: Response) {
        const genre: string = req.params.genre;

        await this.databaseService.ResetWithRelations();
        const result: TestResult = await measurementHandler(async () =>
            this.movieManager.DeleteWithGenre(genre));

        this.databaseService.Dirty =true;

        res.status(200).send(result).end('ok');
    }

    public async CompaniesByLang(req: Request, res: Response) {
        const lang: string = req.params.lang;

        await this.databaseService.ResetWithRelations();
        const  result: TestResult = await measurementHandler(async () =>
            await this.companyManager.DeleteWithLang(lang));

        this.databaseService.Dirty =true;

        res.status(200).send(result).end('ok');
    }
}
