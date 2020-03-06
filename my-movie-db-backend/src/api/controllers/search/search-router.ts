import express from 'express';
import {SearchController} from './search-controller';
import {container} from 'tsyringe';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function SearchRoutes(): express.Router {
    const controller: SearchController = container.resolve(SearchController);
    return express.Router()
        .get('/withStart/:word',
            AsyncExceptionHandler(controller.AllMoviesStartWith.bind(controller)))
        .get('/withLang/:lang',
            AsyncExceptionHandler(controller.AllMoviesWithLang.bind(controller)))
        .get('/withGenre/:genre',
            AsyncExceptionHandler(controller.AllMoviesWithGenre.bind(controller)))
        .get('/budget/:name',
            AsyncExceptionHandler(controller.GetCompanyMoviesBudget.bind(controller)))
        .get('/compLang/:lang',
            AsyncExceptionHandler(controller.AllCompaniesWithMovieLang.bind(controller)));
}

// Search:
//      >Alle Filme mit "S" oder so am Anfang
//      >Alle Filme mit dem Genre "Action" oder so
//      >Alle Companies von Filmen mit "de" als Sprache
//

// nach zu Search:
//      > wir nehmen uns eine Company und laden alle Movies dazu und wollen das Budget aller Filme oder wir machen
//      das für eine Collection