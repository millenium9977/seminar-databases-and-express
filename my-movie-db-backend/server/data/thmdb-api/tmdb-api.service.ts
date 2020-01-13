import {TmdbApi} from 'tmdb-typescript-api';

export class TmdbApiService {
    private api: TmdbApi;

    constructor() {
        api = new TmdbApi()
    }
}

export default new TmdbApiService();
