import express from 'express';
import {SearchController} from './search-controller';
import {container} from 'tsyringe';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function SearchRoutes(): express.Router {
    const controller: SearchController = container.resolve(SearchController);
    return express.Router()
        .get('/contain/:word',
            AsyncExceptionHandler(controller.AllMoviesContain.bind(controller)))
        .get('/withLang/:lang',
            AsyncExceptionHandler(controller.AllMoviesWithLang.bind(controller)))
        .get('/withGenre/:genre',
            AsyncExceptionHandler(controller.AllMoviesWithGenre.bind(controller)))
        .get('/budget/:name',
            AsyncExceptionHandler(controller.GetCompanyMoviesBudget.bind(controller)))
        .get('/compLang/:lang',
            AsyncExceptionHandler(controller.AllCompaniesWithMovieLang.bind(controller)));
}