import {injectable} from 'tsyringe';
import {CollectionManager} from '../../logic/collection-manager';
import {GenreManager} from '../../logic/genre-manager';
import {CompanyManager} from '../../logic/company-manager';
import {CountryManager} from '../../logic/country-manager';
import {LanguageManager} from '../../logic/language-manager';
import {MovieMdManager} from '../../logic/movieMd-manager';
import logger from '../../common/logger';
import {ILanguage} from '../schemas/language-schema';
import {ICountry} from '../schemas/country-schema';
import {ICompany} from '../schemas/company-schema';
import {IGenre} from '../schemas/genre-schema';
import {ICollection} from '../schemas/collection-schema';
import {IMovieMetadata} from '../schemas/movie-metadata-schema';

@injectable()
export class CsvObjectFactory {

    constructor(private readonly _collectionManager: CollectionManager,
        private readonly _genreManager: GenreManager,
        private readonly _companyManager: CompanyManager,
        private readonly _countryManager: CountryManager,
        private readonly _languageManager: LanguageManager,
        private readonly _movieMdManager: MovieMdManager) {
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
    public async CreateMovieMD(data: any[]): Promise<void> {
        const collection: ICollection = await this.createCollections(data[1]);
        const genres: IGenre[] = await this.createGenres(data[3]);
        const countries: ICountry[] = await this.createCounties(data[13]);
        const companies: ICompany[] = await this.createCompanies(data[12]);
        const languages: ILanguage[] = await this.createLanguages(data[17]);

        let movie: IMovieMetadata = await this._movieMdManager.CreateMovieMetadata(
            data[0],
            data[22] | 0,
            data[2] | 0,
            data[4],
            data[7],
            data[8],
            data[9],
            data[10] | 0,
            data[14],
            data[15],
            data[16],
            data[18],
            data[19],
            data[20],
            data[21],
            data[23]
        );

        movie = await this._movieMdManager.AddGenres(movie, genres);
        movie = await this._movieMdManager.AddCollection(movie, collection);
        movie = await this._movieMdManager.AddCompanies(movie, companies);
        movie = await this._movieMdManager.AddCountries(movie, countries);
        await this._movieMdManager.AddLanguages(movie, languages);
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
        return json.replace(/None/g, 'null');
    }

    /**
     * Array has to be like:
     *  0 - Id
     *  1 - Name
     * @param data List of the datafields
     * @param movieMD MovieMetadata to add to the list
     * @constructor
     */
    private async createCollections(data: string): Promise<ICollection> {
        if (!data) {
            return null;
        }

        const record: any = JSON.parse(this.properJsonFormat(data));

        let collection: ICollection = await this._collectionManager.GetCollectionByName(record.name);

        if (!collection) {
            collection = await this._collectionManager.CreateCollection(record.name);
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
    private async createGenres(data: string): Promise<IGenre[]> {
        if (!data) {
            return [];
        }

        const records: any[] = JSON.parse(this.properJsonFormat(data));

        const genres: IGenre[] = [];
        for (const r of records) {
            let genre: IGenre = await this._genreManager.GetGenreByName(r.name);

            if (!genre) {
                genre = await this._genreManager.CreateGenre(r.name);
            }

            genres.push(genre);
        }

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
    private async createCompanies(data: string): Promise<ICompany[]> {

        if (!data) {
            return [];
        }

        let records: any[] = JSON.parse(this.properJsonFormat(data));

        const companies: ICompany[] = [];
        for (const r of records) {
            let company: ICompany = await this._companyManager.GetCompanyByName(r.name);

            if (!company) {
                company = await this._companyManager.CreateCompany(r.name);
            }

            companies.push(company);
        }

        return companies;
    }

    /**
     * Array has to be like:
     * 0 - Iso
     * 1 - Name
     * @param data Array of Country Arrays
     * @constructor
     */
    private async createCounties(data: string): Promise<ICountry[]> {
        if (!data) {
            return [];
        }

        const records: any[] = JSON.parse(this.properJsonFormat(data));

        const countries: ICountry[] = [];
        for (const r of records) {
            let country: ICountry = await this._countryManager.GetCountryByName(r.name);

            if (!country) {
                country = await this._countryManager.CreateCountry(r.name, r.iso_3166_1);
            }

            countries.push(country);
        }

        return countries;
    }

    /**
     * Array has to be like:
     * 0 - Iso
     * 1 - Name
     * @param data Array of Language Arrays
     * @constructor
     */
    private async createLanguages(data: string): Promise<ILanguage[]> {
        if (!data) {
            return [];
        }

        let records: any[];

        try {
            records = JSON.parse(this.properJsonFormat(data));
        } catch (e) {
            logger.debug(data);
        }

        const languages: ILanguage[] = [];
        for (const r of records) {
            if (!r.name || !r.iso_639_1) {
                continue;
            }

            let language: ILanguage = await this._languageManager.GetLanguageByName(r.name);

            if (!language) {
                language = await this._languageManager.CreateLanguage(r.iso_639_1, r.name);
            }

            languages.push(language);
        }

        return languages;
    }
}
