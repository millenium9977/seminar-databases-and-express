import {Application}  from 'express';
import {SaveRoutes}   from './api/controllers/save/save-router';
import {SearchRoutes} from './api/controllers/search/search-router';
import {UpdateRoutes} from './api/controllers/update/update-router';
import {DeleteRoutes} from './api/controllers/delete/delete-router';
import {UtilsRoutes}  from './api/controllers/utils/utils-router';

export default function routes(app: Application): void {
    app.use('/mongodb/save', SaveRoutes());
    app.use('/mongodb/search', SearchRoutes());
    app.use('/mongodb/update', UpdateRoutes());
    app.use('/mongodb/delete', DeleteRoutes());
    app.use('/mongodb/utils', UtilsRoutes());
}
