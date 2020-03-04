import express                 from 'express';
import {UpdateController}      from './update-controller';
import {container}             from 'tsyringe';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function UpdateRoutes(): express.Router {
    const controller: UpdateController = container.resolve(UpdateController);
    return express.Router().get('replace/:char',
        AsyncExceptionHandler(controller.Replace.bind(controller)));
}


// Georg, [27.02.20 11:44]
// Update:
//      >Such alle Movies mit einem "a" im Titel und ersetzt es durch ein "o" oder so man könnte auch noch das Adult
//      Ding toggeln
//
