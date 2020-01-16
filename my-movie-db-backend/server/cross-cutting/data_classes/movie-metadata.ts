import Collection from "./collection";
import Genre from "./genre";
import {Company} from "./company";
import {Language} from "./language";
import {Country} from "./country";

export default class MovieMetadata {
    public Id: string;
    public Adult: boolean;
    public Collection: Collection;
    public Budget: number;
    public Genres: Genre[];
    public Homepage: string;
    public OriginalLanguage: string;
    public OriginalTitle: string;
    public Overview: string;
    public Popularity: number;
    public ProductionCompanies: Company[];
    public ProductionCountries: Country[];
    public ReleaseDate: string;
    public Revenue: number;
    public Runtime: number;
    public Spoken_Languages: Language[];
    public Status: string;
    public Tagline: string;
    public Title: string;
    public Video: string;
    public AvergageVote: number;
    public VoteCount: number;
}