import {injectable}        from 'tsyringe';
import {Movie}             from '../../cross-cutting/data_classes/movie';
import {Collection}        from '../../cross-cutting/data_classes/collection';
import {Genre}             from '../../cross-cutting/data_classes/genre';
import {Company}           from '../../cross-cutting/data_classes/company';
import {Country}           from '../../cross-cutting/data_classes/country';
import {Language}          from '../../cross-cutting/data_classes/language';
import {CollectionManager} from '../../logic/collection-manager';
import {GenreManager}      from '../../logic/genre-manager';
import {CompanyManager}    from '../../logic/company-manager';
import {CountryManager}    from '../../logic/country-manager';
import {LanguageManager}   from '../../logic/language-manager';
import {MovieManager}      from '../../logic/movie-manager';
import logger              from '../../common/logger';

@injectable()
export class CsvObjectFactory {

    constructor(private readonly _collectionManager: CollectionManager,
        private readonly _genreManager: GenreManager,
        private readonly _companyManager: CompanyManager,
        private readonly _countryManager: CountryManager,
        private readonly _languageManager: LanguageManager,
        private readonly _movieManager: MovieManager) {
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
        const collection: Collection = await this.createCollections(data[1]);
        const genres: Genre[]        = await this.createGenres(data[3]);
        const countries: Country[]   = await this.createCountries(data[13]);
        const companies: Company[]   = await this.createCompanies(data[12]);
        const languages: Language[]  = await this.createLanguages(data[17]);

        const movie = await this._movieManager.SaveMovie(
            data[0],
            data[22] | 0,
            data[2] | 0,
            data[4],
            data[7],
            data[8],
            data[9],
            data[10] | 0,
            data[14],
            data[18],
            data[19],
            data[20],
            data[21],
            data[23],
        );

        await this._movieManager.SetLanguages(movie, languages);
        await this._movieManager.SetGenres(movie, genres);
        await this._movieManager.SetCountries(movie, countries);
        await this._movieManager.SetCollection(movie, collection);
        try {
            await this._movieManager.SetCompanies(movie, companies);
        } catch (err) {
            logger.error(err);
        }
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
        json             = json.replace(/\\/g, '');
        json             = json.replace(/((?<=({))'|(?<=(: ))'|'(?=[:,}])|(?<=(, ))')/g, '"');
        return json.replace(/None/g, 'null');
    }

    /**
     * Array has to be like:
     *  0 - Id
     *  1 - Name
     * @param data List of the datafields
     * @constructor
     */
    private async createCollections(data: string): Promise<Collection> {
        if (!data) {
            return null;
        }

        const record: any = JSON.parse(this.properJsonFormat(data));

        return await this._collectionManager.GetOrSaveCollection(record.name);
    }

    /**
     * Genre Array has to be like:
     * 0 - Id
     * 1 - Name
     * @param data An array of Genre Arrays
     * @constructor
     */
    private async createGenres(data: string): Promise<Genre[]> {
        if (!data) {
            return [];
        }

        const records: any[] = JSON.parse(this.properJsonFormat(data));

        const genres: Genre[] = [];
        for (const r of records) {

            const genre = await this._genreManager.GetOrSaveGenre(r.name);
            genres.push(genre);
        }

        return genres;
    }

    /**
     * Company Array has to be like:
     * 0 - Name
     * 1 - Id
     * @param data Array of Company Arrays
     * @constructor
     */
    private async createCompanies(data: string): Promise<Company[]> {

        if (!data) {
            return [];
        }

        let records: any[];
        try {
            records = JSON.parse(this.properJsonFormat(data));
        } catch (e) {
            logger.error(e);
            logger.debug(this.properJsonFormat(data));
        }

        const companies: Company[] = [];
        for (const r of records) {
            const company: Company = await this._companyManager.SaveOrGetCompany(r.name);
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
    private async createCountries(data: string): Promise<Country[]> {
        if (!data) {
            return [];
        }

        const records: any[] = JSON.parse(this.properJsonFormat(data));

        const countries: Country[] = [];
        for (const r of records) {
            const country: Country = await this._countryManager.SaveOrGetCountry(r.name, r.iso_3166_1);
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
    private async createLanguages(data: string): Promise<Language[]> {
        if (!data) {
            return [];
        }

        let records: any[];

        try {
            records = JSON.parse(this.properJsonFormat(data));
        } catch (e) {
            logger.debug(data);
        }

        const languages: Language[] = [];
        for (const r of records) {
            const language = await this._languageManager.SaveOrGetLanguage(r.name, r.iso_639_1);

            languages.push(language);
        }

        return languages;
    }
}
