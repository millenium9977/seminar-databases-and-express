import {Company} from './Company';
import {Movie} from './Movie';
import {Certification} from './Certification';
import {Network} from './Network';
import {EntityBase} from './EntityBase';

export class Country implements EntityBase
{
    public id: number;

    public name: string;
    public iso_3166_1: string;

    public translation: Country;

    public companies: Company[];
    public movies: Movie[];
    public certficates: Certification[];
    public networks: Network[];
}
