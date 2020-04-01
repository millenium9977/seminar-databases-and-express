import {Router}                from 'express';
import {container}             from 'tsyringe';
import {DeleteController}      from './delete-controller';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function DeleteRoutes(): Router {
    const controller: DeleteController = container.resolve(DeleteController);
    return Router()
        .get('/movies/:word',
            AsyncExceptionHandler(controller.Movies.bind(controller)))
        .get('/byLang/:lang',
            AsyncExceptionHandler(controller.MoviesByLang.bind(controller)))
        .get('/byGenre/:genre',
            AsyncExceptionHandler(controller.MoviesByGenre.bind(controller)))
        .get('/companyByLang/:lang',
            AsyncExceptionHandler(controller.CompaniesByLang.bind(controller)));
}
