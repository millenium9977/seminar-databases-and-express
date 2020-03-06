import {injectable}         from 'tsyringe';
import {Request, Response}  from 'express';
import {MovieMdManager}     from '../../../logic/movieMd-manager';
import {DatabaseService}                from '../../../data/database/database-service';
import {measurementHandler, TestResult} from '../../../logic/time-measurement-service';

@injectable()
export class UpdateController {

    constructor(private movieMdManager: MovieMdManager,
        private databaseService: DatabaseService) {
    }

    public async Replace(req: Request, res: Response) {
        const char:string = req.params.char;
        const word:string = req.params.word;

        await this.databaseService.ResetNoRelations();
        const result: TestResult = await measurementHandler(async () => await this.movieMdManager.Replace(char, word));

        res.status(200).send(result).end('ok');
    }
}
