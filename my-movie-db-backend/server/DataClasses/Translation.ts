import {Country} from './Country';
import {Language} from './Language';
import {Movie} from './Movie';
import {EntityBase} from './EntityBase';
import {Data} from './Data';

export class Translation implements EntityBase
{
    public id: number;

    public name: string;
    public english_name: string;

    public country: Country;
    public language: Language;
    public data: Data;

    public movies: Movie[];
}
