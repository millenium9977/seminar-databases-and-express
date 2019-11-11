import {Movie} from './Movie';
import {Translation} from './Translation';
import {EntityBase} from './EntityBase';

export class Language implements EntityBase
{
    public id: number;

    public name: string;
    public iso_639_1: string;

    public translation: Translation;

    public movies: Movie[];
}
