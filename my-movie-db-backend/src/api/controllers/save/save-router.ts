import express from 'express';
import {SaveController} from './save-controller';
import {container} from 'tsyringe';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function SaveRoutes(): express.Router {
    const controller: SaveController = container.resolve(SaveController);
    return express.Router()
        .get('/:count',
            AsyncExceptionHandler(controller.Save.bind(controller)));
}

//
//     Save:
//          >Movies ohne Relationen
//          >Movies mit Relationen
//          >Geht bei Neo4j nicht

// Delete:
//      > Wir nehmen die Aufgabe von Search und Löschen diese dann
//