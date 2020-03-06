import {Router}                from 'express'
import {container}             from 'tsyringe';
import {UpdateController}      from './update-controller';
import {AsyncExceptionHandler} from '../../../Utils/async-exception-handler';

export function UpdateRoutes(): Router {
    const controller: UpdateController = container.resolve(UpdateController);
    return Router().get('/replace/:char/:word',
        AsyncExceptionHandler(controller.Replace.bind(controller)));
}
