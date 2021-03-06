import {singleton} from 'tsyringe';
import Genre from '../cross-cutting/data_classes/genre';
import {IGenreManager} from './contracts/i-genre-manager';

@singleton()
export class GenreManager implements IGenreManager {
    private _genres: Genre[];

    constructor() {
        this._genres = [];
    }

    public GetGenreByName(search: string): Genre {
        return this._genres.find((g) => g.Name === search);
    }

    public SaveGenre(genre: Genre): Genre {
        if (!genre) {
            return null;
        }

        this._genres.push(genre);

        return genre;
    }
}