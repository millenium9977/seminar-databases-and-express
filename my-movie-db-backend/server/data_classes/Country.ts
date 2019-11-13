import {Company} from './Company';
import {Movie} from './Movie';
import {Certification} from './Certification';
import {Network} from './Network';
import {EntityBase} from './EntityBase';
import {Translation} from './Translation';

export class Country implements EntityBase
{
    public id: number;

    public name: string;
    public iso_3166_1: string;

    public translation: Translation;

    public companies: Company[];
    public movies: Movie[];
    public certficates: Certification[];
    public networks: Network[];
}
