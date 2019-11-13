import {Movie} from './Movie';
import {Country} from './Country';
import {EntityBase} from './EntityBase';

export class Company implements EntityBase
{
    public id: number;

    public name: string;
    public logo_path: string;
    public headquarters: string;
    public homepage: string;

    public origin_country: Country;

    public producedMovies: Movie[];
    public parentCompany: Company;
    public dougtherCompanies: Company[];
}
