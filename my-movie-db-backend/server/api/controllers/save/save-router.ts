import {Router}                from 'express';
import {SaveController}        from './save-controller';
import {container}             from 'tsyringe';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function SaveRoutes(): Router {
    const controller: SaveController = container.resolve(SaveController);
    return Router()
        .get('/withRelations/:count',
            AsyncExceptionHandler(controller.WithRelations.bind(controller)))
        .get('/noRealations/:count',
            AsyncExceptionHandler(controller.NoRelations.bind(controller)));
}
