import {injectable} from 'tsyringe';
import MovieMetadata, {IMovieMetadata} from '../data/schemas/movie-metadata-schema';
import {IGenre} from '../data/schemas/genre-schema';
import {ICollection} from '../data/schemas/collection-schema';
import {ICompany} from '../data/schemas/company-schema';
import {ICountry} from '../data/schemas/country-schema';
import {ILanguage} from '../data/schemas/language-schema';

@injectable()
export class MovieMdManager {

    public async CreateMovieMetadata(
        adult: boolean = null,
        averageVote: number = null,
        budget: number = null,
        homepage: string = null,
        originalLanguage: string = null,
        originalTitle: string = null,
        overview: string = null,
        popularity: number = null,
        releaseDate: string = null,
        revenue: number = null,
        runtime: number = null,
        status: string = null,
        tagline: string = null,
        title: string,
        video: string = null,
        voteCount: number = null,
    ): Promise<IMovieMetadata> {
        const movie = new MovieMetadata({
            Adult: adult,
            Budget: budget,
            Homepage: homepage,
            OriginalLanguage: originalLanguage,
            OriginalTitle: originalTitle,
            Overview: overview,
            Popularity: popularity,
            ReleaseDate: releaseDate,
            Revenue: revenue,
            Runtime: runtime,
            Status: status,
            Tagline: tagline,
            Title: title,
            Video: video,
            AverageVote: averageVote,
            VoteCount: voteCount,
            ProductionCompanies: [],
            ProductionCountries: [],
            Spoken_Languages: [],
            Genres: [],
            Collection: null,
        });

        return movie.save();
    }

    public async GetMovieByTitle(title: string): Promise<IMovieMetadata> {
        return MovieMetadata.findOne({Title: title});
    }

    /**
     * Adds a list of genres to a movie object
     * and save the change to the database
     * @param movie
     * @param genres
     * @constructor
     */
    public async AddGenres(movie: IMovieMetadata, genres: IGenre[]): Promise<IMovieMetadata> {
        for(const genre of genres) {
            movie.Genres.push(genre);
        }

        return movie.save();
    }

    /**
     * Sets the bidirectional connection between a movie and a collection
     * and the changes to the database
     * @param movie
     * @param collection
     * @constructor
     */
    public async AddCollection(movie: IMovieMetadata, collection: ICollection) {
        movie.Collection = collection;
        collection.Movies.push(movie);

        await collection.save();
        return movie.save();
    }

    /**
     * Sets the bidirectional connection between a movie and a list of companies
     * and save the changes to the database
     * @param movie
     * @param companies
     * @constructor
     */
    public async AddCompanies(movie: IMovieMetadata, companies: ICompany[]): Promise<IMovieMetadata> {
        for(const company of companies) {
            movie.ProductionCompanies.push(company);
            company.Movies.push(movie);
            await company.save();
        }

        return movie.save();
    }

    /**
     * Adds a list of countries to a movie object
     * and save the change to the database
     * @param movie
     * @param counties
     * @constructor
     */
    public async AddCountries(movie: IMovieMetadata, counties: ICountry[]): Promise<IMovieMetadata> {
        for(const country of counties) {
            movie.ProductionCountries.push(country);
        }

        return movie.save();
    }


    /**
     * Adds a list of languages to a movie object
     * and save the change to the database
     * @param movie
     * @param languages
     * @constructor
     */
    public async AddLanguages(movie: IMovieMetadata, languages: ILanguage[]): Promise<IMovieMetadata> {
        for(const language of languages) {
            movie.Spoken_Languages.push(language);
        }

        return movie.save();
    }
}
