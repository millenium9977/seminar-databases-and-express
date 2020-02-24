import {injectable} from 'tsyringe';
import {CollectionManager} from '../../logic/collection-manager';
import {GenreManager} from '../../logic/genre-manager';
import {CompanyManager} from '../../logic/company-manager';
import {CountryManager} from '../../logic/country-manager';
import {LanguageManager} from '../../logic/language-manager';
import {MovieMdManager} from '../../logic/movieMd-manager';
import {ILanguage} from '../schemas/language-schema';
import {ICountry} from '../schemas/country-schema';
import {ICompany} from '../schemas/company-schema';
import {IGenre} from '../schemas/genre-schema';
import {ICollection} from '../schemas/collection-schema';
import {IMovieMetadata} from '../schemas/movie-metadata-schema';
import logger from '../../common/logger';

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
        // const collection: ICollection = await this.createCollections(data[1]);
        // const companies: ICompany[] = await this.createCompanies(data[12]);

        const genres: IGenre[] = await this.createGenres(data[3]);
        const countries: ICountry[] = await this.createCounties(data[13]);
        const languages: ILanguage[] = await this.createLanguages(data[17]);

        const adult: boolean = this.parseToBool(data[0]);
        const video: boolean = this.parseToBool(data[21]);
        let revenue: number = parseInt(data[15]);
        let runtime: number = parseInt(data[16]);
        let voteCount: number = parseInt(data[23]);

        if (isNaN(runtime)) {
            runtime = 0;
        }

        if (isNaN(revenue)) {
            revenue = 0;
        }

        if (isNaN(voteCount)) {
            voteCount = 0;
        }

        const collection: ICollection = await this._collectionManager.GetCollectionByName(this.getCollectionName(data[1]));
        const companies: ICompany[] = await this.getCompaniesByNames(data[12]);

        let movie: IMovieMetadata = await this._movieMdManager.CreateMovieMetadata(
            adult,
            data[22] | 0,
            data[2] | 0,
            data[4],
            data[7],
            data[8],
            data[9],
            data[10] | 0,
            data[14],
            revenue,
            runtime,
            data[18],
            data[19],
            data[20],
            video,
            voteCount,
            genres,
            companies,
            countries,
            languages,
            collection
        );

        //Adding uni directional shit
        // movie = await this._movieMdManager.AddGenres(movie, genres);
        // movie = await this._movieMdManager.AddCountries(movie, countries);
        // movie = await this._movieMdManager.AddLanguages(movie, languages);



        //Adding bidirectional one to many
        // if (collection) {
        //     movie = await this._movieMdManager.AddCollection(movie, collection);
        // }
        //
        // //Adding bidirectional many to many
        // movie = await this._movieMdManager.AddCompanies(movie, companies);
    }



    private getCollectionName(data: string): string {
        if (!data) {
            return null;
        }

        const record: any = JSON.parse(this.properJsonFormat(data));
        // return await this._collectionManager.CreateOrGetCollection(record.name);
        return record.name;
    }

    private async getCompaniesByNames(data: string): Promise<ICompany[]> {
        if(!data) {
            return null;
        }

        const record: any[] = JSON.parse(this.properJsonFormat(data));


        const companies: ICompany[] = [];
        for(const r of record) {
            const company: ICompany = await this._companyManager.GetCompanyByName(r.name);
            companies.push(company);
        }

        return companies;
    }

    private parseToBool(value: string) {
        value = value.toLowerCase();
        if (value === 'true') {
            return true;
        } else if (value === 'false') {
            return false;
        }

        return true;
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
        // return await this._collectionManager.CreateOrGetCollection(record.name);
        return await this._collectionManager.CreateCollection(record.name);
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
            // const genre = await this._genreManager.CreateOrGetGenre(r.name);
            // const genre = await this._genreManager.CreateGenre(r.name);
            // genres.push(genre);

            const genre: IGenre = this._genreManager.CreateGenreObject(r.name);
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
            // const company = await this._companyManager.CreateOrGetCompany(r.name);
            const company = await this._companyManager.CreateCompany(r.name);

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
            // const country = await this._countryManager.CreateOrGetCountry(r.name, r.iso_3166_1);
            // const country = await this._countryManager.CreateCountry(r.name, r.iso_3166_1);
            const country = await  this._countryManager.CreateCountryObject(r.name, r.iso_3166_1);

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

        const records: any[] = JSON.parse(this.properJsonFormat(data));

        const languages: ILanguage[] = [];
        for (const r of records) {
            if (!r.name || !r.iso_639_1) {
                continue;
            }

            // const language = await this._languageManager.CreateOrGetLanguage(r.name, r.iso_639_1);
            // const language = await this._languageManager.CreateLanguage(r.name, r.iso_639_1);
            const language = await this._languageManager.CreateLanguageObject(r.name, r.iso_639_1);

            languages.push(language);
        }

        return languages;
    }

    public GetCompanies(data: any[]): ICompany[] {
        const companyData: string = data[12];
        let records: any[] = JSON.parse(this.properJsonFormat(companyData));


        const companies: ICompany[] = [];
        for (const r of records) {
            const company: ICompany = this._companyManager.createCompanyObject(r.name);
            companies.push(company);
        }
        return companies;
    }

    public GetCollection(data: any[]): ICollection {
        const collectionData = data[1];

        if (!collectionData) {
            return null;
        }

        const record: any = JSON.parse(this.properJsonFormat(collectionData));
        return this._collectionManager.CreateCollectionObject(record.name);
    }
}
