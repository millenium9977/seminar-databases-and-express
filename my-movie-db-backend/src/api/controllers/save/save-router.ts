import express from 'express';
import {SaveController} from './save-controller';
import {container} from 'tsyringe';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function SaveRoutes(): express.Router {
    const controller: SaveController = container.resolve(SaveController);
    return express.Router()
        .get('/withRelations/:count',
            AsyncExceptionHandler(controller.SaveWithRelationships.bind(controller)))
        .get('/noRelations/:count',
            AsyncExceptionHandler(controller.Save.bind(controller)));
}
