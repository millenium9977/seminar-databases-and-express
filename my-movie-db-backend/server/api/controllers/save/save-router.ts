import express                 from 'express';
import {SaveController}        from './save-controller';
import {container}             from 'tsyringe';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function SaveRoutes(): express.Router {
    const controller: SaveController = container.resolve(SaveController);
    return express.Router()
        .get('/withRelations/:count',
            AsyncExceptionHandler(controller.SaveWithRelations.bind(controller)))
        .get('/noRelations/:count',
            AsyncExceptionHandler(controller.SaveNoRelations.bind(controller)));
}


// Georg, [27.02.20 11:42]
// Okay also wegen den Test folgender Vorschlag:
//
//     Save:
//          >Movies ohne Relationen
//          >Movies mit Relationen
//

// Delete:
//      > Wir nehmen die Aufgabe von Search und Löschen diese dann
//

