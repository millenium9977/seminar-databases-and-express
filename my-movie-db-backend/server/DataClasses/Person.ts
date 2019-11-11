import {Movie} from './Movie';
import {Review} from './Review';
import {EntityBase} from './EntityBase';

export class Person implements EntityBase
{
    public id: number;

    public name: string;
    public birthday: string;
    public known_for_department: string;
    public deathday: string;
    public gender: string;
    public biography: string;
    public popularity: number;
    public place_of_birth: string;
    public adult: boolean;
    public imdb_id: number;
    public homepage: string;

    public directedIn: Movie[];
    public actedIn: Movie[];
    public reviews: Review[];
}
