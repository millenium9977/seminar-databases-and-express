import {Router}                from 'express';
import {UtilsController}       from './utils-controller';
import {container}             from 'tsyringe';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function UtilsRoutes(): Router {
    const controller: UtilsController = container.resolve(UtilsController);
    return Router()
        .get('/movies/:word',
            AsyncExceptionHandler(controller.MoviesByWord.bind(controller)))
        .get('/movies',
            AsyncExceptionHandler(controller.Movies.bind(controller)))
        .get('/companies',
            AsyncExceptionHandler(controller.Companies.bind(controller)));
}
