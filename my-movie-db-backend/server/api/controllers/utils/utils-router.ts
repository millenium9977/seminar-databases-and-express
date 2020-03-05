import express                 from 'express';
import {UtilsController}       from './utils-controller';
import {container}             from 'tsyringe';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function UtilsRoutes(): express.Router {
    const controller: UtilsController = container.resolve(UtilsController);
    return express.Router().get('/movies/:word', AsyncExceptionHandler(controller.MoviesByWord.bind(controller)));
}
