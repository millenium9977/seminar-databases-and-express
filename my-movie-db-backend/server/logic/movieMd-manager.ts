import {injectable} from 'tsyringe';
import MovieMetadata, {IMovieMetadata} from '../data/schemas/movie-metadata-schema';
import {IGenre} from '../data/schemas/genre-schema';
import {ICollection} from '../data/schemas/collection-schema';
import {ICompany} from '../data/schemas/company-schema';
import {ICountry} from '../data/schemas/country-schema';
import {ILanguage} from '../data/schemas/language-schema';
import mongoose from 'mongoose';
import logger from '../common/logger';

@injectable()
export class MovieMdManager {

    public async CreateMovieMetadata(
        adult: boolean = false,
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
        video: boolean = false,
        voteCount: number = null,
        genres: IGenre[] = null,
        companies: ICompany[] = null,
        countries: ICountry[] = null,
        languages: ILanguage[] = null,
        collection: ICollection = null,
    ): Promise<IMovieMetadata> {
        try {
            let movie: IMovieMetadata = await MovieMetadata.findOne({Title: title});
            if (!movie) {
                movie = new MovieMetadata({
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
                    ProductionCompanies: companies,
                    ProductionCountries: countries,
                    Spoken_Languages: languages,
                    Genres: genres,
                    Collection: collection,
                });



                await movie.save();

                if(collection != null) {
                    collection.Movies.push(collection);
                    await collection.save();
                }

                if(companies != null) {
                    for (const company of companies) {
                        company.Movies.push(movie);
                        await company.save();
                    }
                }

            }
            return movie;
        } catch (e) {
            logger.error(e);
            return MovieMetadata.findOne({Title: title});
        }
    }


    // public async CreateOrGetMovieMetadata(
    //     adult: boolean = false,
    //     averageVote: number = null,
    //     budget: number = null,
    //     homepage: string = null,
    //     originalLanguage: string = null,
    //     originalTitle: string = null,
    //     overview: string = null,
    //     popularity: number = null,
    //     releaseDate: string = null,
    //     revenue: number = null,
    //     runtime: number = null,
    //     status: string = null,
    //     tagline: string = null,
    //     title: string,
    //     video: boolean = false,
    //     voteCount: number = null,
    // ): Promise<IMovieMetadata> {
    //     const session = await mongoose.startSession();
    //     session.startTransaction();
    //     try {
    //         const opts = {session, new: true};
    //         let movie: IMovieMetadata = await MovieMetadata.findOne({Title: title}, opts);
    //         if (!movie) {
    //             movie = new MovieMetadata({
    //                 Adult: adult,
    //                 Budget: budget,
    //                 Homepage: homepage,
    //                 OriginalLanguage: originalLanguage,
    //                 OriginalTitle: originalTitle,
    //                 Overview: overview,
    //                 Popularity: popularity,
    //                 ReleaseDate: releaseDate,
    //                 Revenue: revenue,
    //                 Runtime: runtime,
    //                 Status: status,
    //                 Tagline: tagline,
    //                 Title: title,
    //                 Video: video,
    //                 AverageVote: averageVote,
    //                 VoteCount: voteCount,
    //                 ProductionCompanies: [],
    //                 ProductionCountries: [],
    //                 Spoken_Languages: [],
    //                 Genres: [],
    //                 Collection: null,
    //             });
    //
    //             await movie.save(opts);
    //         }
    //         await session.commitTransaction();
    //         session.endSession();
    //         return movie;
    //     } catch (err) {
    //         logger.error(err);
    //         await session.abortTransaction();
    //         session.endSession();
    //         throw err;
    //     }
    //
    // }

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
        for (const genre of genres) {
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
        for (const company of companies) {
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
        for (const country of counties) {
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
        for (const language of languages) {
            movie.Spoken_Languages.push(language);
        }

        return movie.save();
    }

    public async FilterWithWord(word: string): Promise<IMovieMetadata[]> {
        const regEx = new RegExp(word, 'g');
        return await MovieMetadata.find({Title: regEx});
    }

    public async FilterWithLang(lang: string): Promise<IMovieMetadata[]> {
        return await MovieMetadata.find({'Spoken_Languages.Name': lang});
    }

    public async FilterWithGenre(genre: string): Promise<IMovieMetadata[]> {
        return await MovieMetadata.find({'Genres.Name': genre});
    }
}
