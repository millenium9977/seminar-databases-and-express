import {Router}                from 'express';
import {SearchController}      from './search-controller';
import {container}             from 'tsyringe';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function SearchRoutes(): Router {
    const controller: SearchController = container.resolve(SearchController);
    return Router()
        .get('/movies/:word',
            AsyncExceptionHandler(controller.AllMovies.bind(controller)))
        .get('/withLang/:lang',
            AsyncExceptionHandler(controller.MoviesWithLang.bind(controller)))
        .get('/withGenre/:genre',
            AsyncExceptionHandler(controller.MovesWithGenre.bind(controller)))
        .get('/budget/:name',
            AsyncExceptionHandler(controller.GetCompanyMoviesBudget.bind(controller)))
        .get('/compLang/:lang',
            AsyncExceptionHandler(controller.CompaniesByLang.bind(controller)));
}
