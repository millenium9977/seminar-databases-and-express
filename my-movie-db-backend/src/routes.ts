import {Application} from 'express';
import {SaveRoutes}   from './api/controllers/save/save-router';
import {SearchRoutes} from './api/controllers/search/search-router';
import {DeleteRoutes} from './api/controllers/delete/delete-router';
import {UpdateRoutes} from './api/controllers/update/update-router';
import {UtilsRoutes}  from './api/controllers/utils/utils-router';

export default function routes(app: Application): void {
    app.use('/neo4j/save', SaveRoutes());
    app.use('/neo4j/search', SearchRoutes());
    app.use('/neo4j/delete', DeleteRoutes());
    app.use('/neo4j/update', UpdateRoutes());
    app.use('/neo4j/utils', UtilsRoutes());
};