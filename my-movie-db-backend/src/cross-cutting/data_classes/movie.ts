import {Collection} from './collection';
import {Genre}      from './genre';
import {Company}    from './company';
import {Language}   from './language';
import {Country}    from './country';

export class Movie {
    public id: string;
    public adult: boolean;
    public collection: Collection;
    public budget: number;
    public genres: Genre[];
    public homepage: string;
    public originalLanguage: string;
    public originalTitle: string;
    public overview: string;
    public popularity: number;
    public productionCompanies: Company[];
    public productionCountries: Country[];
    public releaseDate: string;
    public revenue: number;
    public runtime: number;
    public spoken_Languages: Language[];
    public status: string;
    public tagline: string;
    public title: string;
    public video: boolean;
    public averageVote: number;
    public voteCount: number;
}