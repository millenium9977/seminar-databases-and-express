import {Movie} from './Movie';
import {Person} from './Person';
import {EntityBase} from './EntityBase';

export class Review implements EntityBase
{
    public id: number;

    public content: string;

    public reviewedMovie: Movie;
    public reviewer: Person;
}
