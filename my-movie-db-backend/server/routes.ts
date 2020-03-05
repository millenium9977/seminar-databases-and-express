import {Application}  from 'express';
import {SaveRoutes}   from './api/controllers/save/save-router';
import {SearchRoutes} from './api/controllers/search/search-router';
import {DeleteRoutes} from './api/controllers/delete/delete-router';
import {UpdateRoutes} from './api/controllers/update/update-router';
import {UtilsRoutes}  from './api/controllers/utils/utils-router';

export default function routes(app: Application): void {
    app.use('/mariadb/save', SaveRoutes());
    app.use('/mariadb/search', SearchRoutes());
    app.use('/mariadb/delete', DeleteRoutes());
    app.use('/mariadb/update', UpdateRoutes());
    app.use('/mariadb/utils', UtilsRoutes());
}
