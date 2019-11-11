import {Country} from './Country';
import {Movie} from './Movie';
import {EntityBase} from './EntityBase';

export class Network implements EntityBase
{
    public id: number;

    public homepage: string;
    public headquaters: string;
    public name: string;

    public origin_country: Country[];
    public movie: Movie;
}
