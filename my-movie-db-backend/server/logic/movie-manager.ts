import {singleton}                 from 'tsyringe';
import {Movie}                     from '../cross-cutting/data_classes/movie';
import {getRepository, Repository} from 'typeorm';
import {Collection}                from '../cross-cutting/data_classes/collection';
import {Genre}                     from '../cross-cutting/data_classes/genre';
import {Country}                   from '../cross-cutting/data_classes/country';
import {Language}                  from '../cross-cutting/data_classes/language';
import {Company}                   from '../cross-cutting/data_classes/company';

@singleton()
export class MovieManager {

    public async SaveMovie(
        adult: boolean           = false,
        averageVote: number      = 0,
        budget: number           = 0,
        hompage: string          = '',
        originalLanguage: string = '',
        originalTitle: string    = '',
        overview: string         = '',
        popularity: number       = 0,
        releaseDate: string      = '',
        status: string           = '',
        tagline: string          = '',
        title: string,
        video: boolean           = false,
        voteCount: number        = 0,
    ): Promise<Movie> {
        return await getRepository(Movie).save({
            Adult: adult,
            Budget: budget,
            Collection: null,
            Genres: [],
            Homepage: hompage,
            OriginalLanguage: originalLanguage,
            OriginalTitle: originalTitle,
            Overview: overview,
            Popularity: popularity,
            ProductionCountries: [],
            ProductionCompanies: [],
            ReleaseDate: releaseDate,
            Spoken_Languages: [],
            Status: status,
            Tagline: tagline,
            Title: title,
            Video: video,
            VoteCount: voteCount,
        });
    }

    public async SetLanguages(movie: Movie, languages: Language[]) {
        const repository: Repository<Movie> = getRepository(Movie);
        const movieWithLanguages: Movie     = await repository.findOne(movie.Id, {relations: [Movie.LanguagesProperty]});

        for (const language of languages) {
            movieWithLanguages.Spoken_Languages.push(language);
        }

        return await repository.save(movieWithLanguages);
    }

    public async GetMoviesByTitle(title: string): Promise<Movie[]> {
        return await getRepository(Movie).find({Title: title});
    }

    public async SetGenres(movie: Movie, genres: Genre[]) {
        const repository: Repository<Movie> = getRepository(Movie);
        const movieWithGenres: Movie        = await repository.findOne(movie.Id, {relations: [Movie.GenresProperty]});

        for (const genre of genres) {
            movieWithGenres.Genres.push(genre);
        }

        return await repository.save(movieWithGenres);
    }

    public async SetCountries(movie: Movie, countries: Country[]) {
        const repository: Repository<Movie> = getRepository(Movie);
        const movieWithCountries: Movie     = await repository.findOne(movie.Id, {relations: [Movie.CountriesProperty]});

        for (const country of countries) {
            movieWithCountries.ProductionCountries.push(country);
        }

        return await repository.save(movieWithCountries);
    }

    public async SetCollection(movie: Movie, collection: Collection): Promise<Movie> {
        if (!collection || !movie) {
            return null;
        }

        const repositoryMovie: Repository<Movie>           = getRepository(Movie);
        const repositoryCollection: Repository<Collection> = getRepository(Collection);
        const movieWithCollection: Movie                   = await repositoryMovie.findOne(movie.Id);
        const collectionWithMovies: Collection             = await repositoryCollection.findOne(collection.Id, {relations: [Collection.MoviesProperty]});

        movieWithCollection.Collection = collection;
        collectionWithMovies.Movies.push(movie);

        await repositoryCollection.save(collectionWithMovies);
        return await repositoryMovie.save(movieWithCollection);
    }

    public async SetCompanies(movie: Movie, companies: Company[]): Promise<Movie> {
        if (!companies || !movie) {
            return null;
        }

        const repositoryMovie: Repository<Movie>           = getRepository(Movie);
        const repositoryCompany: Repository<Company> = getRepository(Company);
        const movieWithCompanies: Movie                   = await repositoryMovie.findOne(movie.Id, {relations: [Movie.CompaniesProperty]});

        for (const company of companies) {
            const companyWithMovies: Company = await repositoryCompany.findOne(company.Id, {relations: [Company.MoviesProperty]});

            movieWithCompanies.ProductionCompanies.push(company);
            companyWithMovies.Movies.push(movieWithCompanies);

            await repositoryCompany.save(companyWithMovies);
        }

        return await repositoryMovie.save(movieWithCompanies);
    }
}
