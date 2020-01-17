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
import {MovieMdManager} from "../../logic/movieMd-manager";
import logger from "../../common/logger";

@injectable()
export class CsvObjectFactory {

    private readonly _companyManager: CompanyManager;
    private readonly _collectionManager: CollectionManager;
    private readonly _countryManager: CountryManager;
    private readonly _genreManager: GenreManager;
    private readonly _languageManager: LanguageManager;
    private readonly _movieMdManager: MovieMdManager;

    constructor(collectionManager: CollectionManager,
                genreManager: GenreManager,
                companyManager: CompanyManager,
                countryManager: CountryManager,
                languageManager: LanguageManager,
                movieMdManager: MovieMdManager) {
        this._collectionManager = collectionManager;
        this._genreManager = genreManager;
        this._companyManager = companyManager;
        this._countryManager = countryManager;
        this._languageManager = languageManager;
        this._movieMdManager = movieMdManager;
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
    public CreateMovieMD(data: any[]): void {
        const movieMd = new MovieMetadata();
        movieMd.Adult = data[0];
        movieMd.AvergageVote = data[22] | 0;
        movieMd.Budget = data[2] | 0;
        movieMd.Collection = this.createCollections(data[1], movieMd);
        movieMd.Genres = this.createGenres(data[3]);
        movieMd.Homepage = data[4];
        movieMd.Id = data[5];
        movieMd.OriginalLanguage = data[7];
        movieMd.OriginalTitle = data[8];
        movieMd.Overview = data[9];
        movieMd.Popularity = data[10] | 0;
        movieMd.ProductionCountries = this.createCounties(data[13]);
        movieMd.ProductionCompanies = this.createCompanies(data[12], movieMd);
        movieMd.ReleaseDate = data[14];
        movieMd.Spoken_Languages = this.createLanguages(data[17]);
        movieMd.Status = data[18];
        movieMd.Tagline = data[19];
        movieMd.Title = data[20];
        movieMd.Video = data[21];
        movieMd.VoteCount = data[23];

        this._movieMdManager.SaveMovie(movieMd);
    }

    /**
     * Faulty stuff i have found:
     *   1 - The used single quotes
     *   2 - Some Names Contain single quotes so just replace ' is not possible
     *   3 - Instead of 'null' the used 'None'.....
     *   4 - A Company used " inside of their Name -> we have to do this first bc its easier
     *   5 - \ inside a string are not allowed we just throw them away
     * @param data A string which is faulty json and from the dataset
     */
    private properJsonFormat(data: string): string {
        let json: string = data.replace(/"/g, '\'');
        json = json.replace(/\\/g, '');
        json = json.replace(/((?<=({))'|(?<=(: ))'|'(?=[:,}])|(?<=(, ))')/g, '"');
        return json.replace(/None/g, 'null')
    }

    /**
     * Array has to be like:
     *  0 - Id
     *  1 - Name
     * @param data List of the datafields
     * @param movieMD MovieMetadata to add to the list
     * @constructor
     */
    private createCollections(data: string, movieMD: MovieMetadata): Collection {
        if (!data) {
            return null
        }

        const record: any = JSON.parse(this.properJsonFormat(data));

        let collection: Collection = this._collectionManager.GetCollectionByName(record.name);
        if (collection) {
            collection.Movies.push(movieMD);
            return collection;
        }

        collection = {
            Id: record.id,
            Name: record.name,
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
    private createGenres(data: string): Genre[] {
        if (!data) {
            return []
        }

        const records: any[] = JSON.parse(this.properJsonFormat(data));

        const genres: Genre[] = [];
        records.forEach((r) => {
            let genre: Genre = this._genreManager.GetGenreByName(r.name);

            if (!genre) {
                genre = {
                    Id: r.id,
                    Name: r.name,
                }
            }

            genres.push(genre);
        });

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
    private createCompanies(data: string, movieMD: MovieMetadata): Company[] {

        if (!data) {
            return []
        }

        let records: any[];
        try {
            records = JSON.parse(this.properJsonFormat(data));
        } catch (e) {
            logger.error(e);
            logger.debug(this.properJsonFormat(data));
        }

        const companies: Company[] = [];
        records.forEach((r) => {
            let company: Company = this._companyManager.GetCompanyByName(r.name);

            if (!company) {
                company = {
                    Name: r.name,
                    Id: r.id,
                    Movies: [movieMD],
                }
            }

            companies.push(company);
        });

        return companies;
    }

    /**
     * Array has to be like:
     * 0 - Iso
     * 1 - Name
     * @param data Array of Country Arrays
     * @constructor
     */
    private createCounties(data: string): Country[] {
        if (!data) {
            return []
        }

        const records: any[] = JSON.parse(this.properJsonFormat(data));

        const countries: Country[] = [];
        records.forEach((r) => {
            let country: Country = this._countryManager.GetCountryByName(r.name);

            if (!country) {
                country = {
                    Id: null,
                    Name: r.name,
                    Code: r.iso_3166_1,
                }
            }

            countries.push(country);
        });

        return countries;
    }

    /**
     * Array has to be like:
     * 0 - Iso
     * 1 - Name
     * @param data Array of Language Arrays
     * @constructor
     */
    private createLanguages(data: string): Language[] {
        if (!data) {
            return []
        }

        let records: any[];

        try {
            records = JSON.parse(this.properJsonFormat(data));
        } catch (e) {
            logger.debug(data);
        }

        const languages: Language[] = [];
        records.forEach((r) => {
            let language: Language = this._languageManager.GetLanguageByName(r.name);

            if (!language) {
                language = {
                    Id: null,
                    Name: r.name,
                    Code: r.iso_639_1,
                }
            }

            languages.push(language);
        });

        return languages;
    }
}