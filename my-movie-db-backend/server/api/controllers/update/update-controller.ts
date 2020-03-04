import {Request, Response} from 'express';
import {injectable}        from 'tsyringe';

@injectable()
export class UpdateController {
    public async Replace(req: Request, res: Response) {
        const char = req.params.char;
    }
}
