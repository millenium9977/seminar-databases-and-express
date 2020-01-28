import {singleton} from 'tsyringe';
import {IMovieMdManager} from './contracts/i-movieMd-manager';
import {MovieMetadata} from '../cross-cutting/data_classes/movie-metadata';

@singleton()
export class MovieMdManager implements IMovieMdManager {
    private _movieMds: MovieMetadata[];

    constructor() {
        this._movieMds = [];
    }

    SaveMovie(movie: MovieMetadata): MovieMetadata {
        if (!movie) {
            return null;
        }

        this._movieMds.push(movie);

        return movie;
    }

    GetMovieByTitle(title: string): MovieMetadata {
        return this._movieMds.find((m) => m.Title === title);
    }

}
