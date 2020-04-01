
import express from 'express';
import {DeleteController} from './delete-controller';
import {container} from 'tsyringe';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function DeleteRoutes(): express.Router {
    const controller: DeleteController = container.resolve(DeleteController);
    return express.Router()
        .get('/movies/:word',
            AsyncExceptionHandler(controller.AllMoviesContain.bind(controller)))
        .get('/withLang/:lang',
            AsyncExceptionHandler(controller.AllMoviesWithLang.bind(controller)))
        .get('/withGenre/:genre',
            AsyncExceptionHandler(controller.AllMoviesWithGenre.bind(controller)))
        .get('/companyByLang/:lang',
            AsyncExceptionHandler(controller.AllCompaniesByMovieByLanguage.bind(controller)));
}
