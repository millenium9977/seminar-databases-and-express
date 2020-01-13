import {Movie} from './Movie';
import {EntityBase} from './EntityBase';

export class Genre implements EntityBase
{
    public id: number;

    public name: string;
    public movies: Movie[];
}
