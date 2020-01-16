import {injectable} from "tsyringe";
import MovieMetadata from "../../cross-cutting/data_classes/movie-metadata";
import Collection from "../../cross-cutting/data_classes/collection";
import Genre from "../../cross-cutting/data_classes/genre";
import {Company} from "../../cross-cutting/data_classes/company";
import {Country} from "../../cross-cutting/data_classes/country";
import {Language} from "../../cross-cutting/data_classes/language";
import {CollectionManager} from "../../logic/collection-manager";
import {GenreManager} from "../../logic/genre-manager";
import {CompanyManager} from "../../logic/company-manager";
import {CountryManager} from "../../logic/country-manager";
import {LanguageManager} from "../../logic/language-manager";

@injectable()
export class CsvObjectFactory {

    private readonly _companyManager: CompanyManager;
    private readonly _collectionManager: CollectionManager;
    private readonly _countryManager: CountryManager;
    private readonly _genreManager: GenreManager;
    private readonly _languageManager: LanguageManager;

    constructor(collectionManager: CollectionManager,
                genreManager: GenreManager,
                companyManager: CompanyManager,
                countryManager: CountryManager,
                languageManager: LanguageManager) {
        this._collectionManager = collectionManager;
        this._genreManager = genreManager;
        this._companyManager = companyManager;
    }

    /**
     * Array Has to be like (but obviously [] starts by zero ;D )
     *  1 - Adult
     *  2 - Collection
     *  3 - Budget
     *  4 - Genres
     *  5 - Homepage,
     *  6 - Id,
     *  7 - Imdb_id
     *  8 - Original_language
     *  9 - Original_title
     *  10 - Overview
     *  11 - Popularity
     *  12 - Poster_path
     *  13 - Production_companies
     *  14 - Production_countries
     *  15 - Release_date
     *  16 - Revenue
     *  17 - Runtime
     *  18 - Spoken_languages
     *  19 - Status
     *  20 - Tagline
     *  21 - Title
     *  22 - Video
     *  23 - Vote_average
     *  24 - Vote_count
     * @param data List with the data to create the MovieMetadata
     * @constructor
     */
    public CreateMovieMD(data: any[]): MovieMetadata {
        const movieMd = new MovieMetadata();
        movieMd.Adult = data[0];
        movieMd.AvergageVote = data[22] | 0;
        movieMd.Budget = data[2] | 0;
        movieMd.Collection = this.CreateCollections(data[1], movieMd);
        movieMd.Genres = this.CreateGernes(data[3]);
        movieMd.Homepage = data[4];
        movieMd.Id = data[5];
        movieMd.OriginalLanguage = data[7];
        movieMd.OriginalTitle = data[8];
        movieMd.Overview = data[9];
        movieMd.Popularity = data[10] | 0;
        movieMd.ProductionCountries = this.CreateCounties(data[13]);
        movieMd.ProductionCompanies = this.CreateCompanies(data[12], movieMd);
        movieMd.ReleaseDate = data[14];
        movieMd.Spoken_Languages = this.CreateLanguages(data[18]);
        movieMd.Status = data[18];
        movieMd.Tagline = data[19];
        movieMd.Title = data[20];
        movieMd.Video = data[21];
        movieMd.VoteCount = data[23];

        return movieMd;
    }

    /**
     * Array has to be like:
     *  0 - Id
     *  1 - Name
     * @param data List of the datafields
     * @param movieMD MovieMetadata to add to the list
     * @constructor
     */
    private CreateCollections(data: any[], movieMD: MovieMetadata): Collection {
        if(!data) {
            return null
        }

        let collection: Collection = this._collectionManager.GetCollectionByName(data[1]);
        if(collection) {
            collection.Movies.push(movieMD);
            return collection;
        }

        collection = {
            Id: data[0],
            Name: data[1],
            Movies: [movieMD]
        }

        return collection;
    }

    /**
     * Genre Array has to be like:
     * 0 - Id
     * 1 - Name
     * @param data An array of Genre Arrays
     * @constructor
     */
    private CreateGernes(data: any[]): Genre[] {
        if(!data) {
            return []
        }

        const genres: Genre[] = [];
        data.forEach((d) => {
            let genre: Genre = this._genreManager.GetGenreByName(d[1]);

            if(!genre) {
                genre = {
                    Id: data[0],
                    Name: data[1],
                }
            }

            genres.push(genre);
        })

        return genres;
    }

    /**
     * Company Array has to be like:
     * 0 - Name
     * 1 - Id
     * @param data Array of Company Arrays
     * @param movieMD MovieMD which will be associated with the Companies
     * @constructor
     */
    private CreateCompanies(data: any[], movieMD: MovieMetadata): Company[] {
        if(!data) {
            return []
        }

        const companies: Company[] = [];
        data.forEach((d) => {
            let company: Company = this._companyManager.GetCompanyByName(d[0]);

            if(!company) {
                company = {
                    Name: d[0],
                    Id: d[1],
                    Movies: [movieMD],
                }
            }

            companies.push(company);
        })

        return companies;
    }

    /**
     * Array has to be like:
     * 0 - Iso
     * 1 - Name
     * @param data Array of Country Arrays
     * @constructor
     */
    private CreateCounties(data: any[]): Country[]{
        if(!data) {
            return []
        }

        const countries: Country[] = [];
        data.forEach((d) => {
            let country: Country = this._countryManager.GetCountryByName(d[1]);

            if(!country) {
                country = {
                    Id: null,
                    Name: data[1],
                    Code: data[0],
                }
            }

            countries.push(country);
        })

        return countries;
    }

    /**
     * Array has to be like:
     * 0 - Iso
     * 1 - Name
     * @param data Array of Language Arrays
     * @constructor
     */
    private CreateLanguages(data: any[]): Language[]{
        if(!data) {
            return []
        }

        const languages: Language[] = [];
        data.forEach((d) => {
            let language: Language = this._languageManager.GetLanguageByName(d[1]);

            if(!language) {
                language = {
                    Id: null,
                    Name: data[1],
                    Code: data[0],
                }
            }

            languages.push(language);
        })

        return languages;
    }
}