import {Genre} from './Genre';
import {Person} from './Person';
import {Review} from './Review';
import {Company} from './Company';
import {Country} from './Country';
import {Language} from './Language';
import {Translation} from './Translation';
import {EntityBase} from './EntityBase';
import {Data} from './Data';


export class Movie implements EntityBase
{

    public id: number;

    public adult: boolean;
    public budget: number;
    public original_language: string;
    public original_title: string;
    //TODO: kann sein das die von ORM's automatisch generiert werden
    public imdb_id: string;
    public popularity: string;
    public poster_path: string;
    public release_date: string;
    public revenue: number;
    public runtime: number;
    public vote_average: number;
    public vote_count: number;

    public gerne: Genre;
    public director: Person;
    public data: Data;

    public actors: Person[];
    public reviews: Review[];
    public productionCompany: Company[];
    public producedIn: Country[];
    public certificatedFor: Country[];
    public translatedLanguages: Language[];
    public translations: Translation[];
}
