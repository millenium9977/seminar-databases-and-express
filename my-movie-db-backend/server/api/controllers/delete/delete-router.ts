import {Router}                from 'express';
import {container}             from 'tsyringe';
import {DeleteController}      from './delete-controller';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function DeleteRoutes(): Router {
    const controller: DeleteController = container.resolve(DeleteController);
    return Router()
        .get('/movies/:word',
            AsyncExceptionHandler(controller.Movies.bind(controller)))
        .get('/withLang/:lang',
            AsyncExceptionHandler(controller.MoviesByLang.bind(controller)))
        .get('/withGenre/:genre',
            AsyncExceptionHandler(controller.MoviesByGenre.bind(controller)))
        .get('/companyByLang/:lang',
            AsyncExceptionHandler(controller.CompaniesByLang.bind(controller)));
}
