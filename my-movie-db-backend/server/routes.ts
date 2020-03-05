import {Application} from 'express';
import {SaveRoutes} from './api/controllers/save/save-router';
import {SearchRoutes} from './api/controllers/search/search-router';

export default function routes(app: Application): void {
    app.use('/mongodb/save', SaveRoutes());
    app.use('/mongodb/search', SearchRoutes());
}
