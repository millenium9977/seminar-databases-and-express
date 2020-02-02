import {singleton} from 'tsyringe';
import {Movie} from '../cross-cutting/data_classes/movie';
import {Collection} from '../cross-cutting/data_classes/collection';
import {Genre} from '../cross-cutting/data_classes/genre';
import {Country} from '../cross-cutting/data_classes/country';
import {Language} from '../cross-cutting/data_classes/language';
import {Company} from '../cross-cutting/data_classes/company';
import ogmneo from "ogmneo/index";

@singleton()
export class MovieManager {

    public async GetOrSaveMovie(
        adult: boolean = false,
        averageVote: number = 0,
        budget: number = 0,
        hompage: string = '',
        originalLanguage: string = '',
        originalTitle: string = '',
        overview: string = '',
        popularity: number = 0,
        releaseDate: string = '',
        status: string = '',
        tagline: string = '',
        title: string,
        video: boolean = false,
        voteCount: number = 0
    ): Promise<Movie> {
        if(title.indexOf('\'') !== -1) {
            title = title.replace(/'/g, '') // database doesnt like ' inside their queries
        }
        let movie: Movie;
        try {
            movie = await this.GetMovieByTitle(title);
            if (movie.title) {
                return movie;
            }
        } catch (err) {
            movie = await ogmneo.Node.create({
                adult: adult,
                budget: budget,
                homepage: hompage,
                originalLanguage: originalLanguage,
                originalTitle: originalTitle,
                overview: overview,
                popularity: popularity,
                releaseDate: releaseDate,
                status: status,
                tagline: tagline,
                title: title,
                video: video,
                voteCount: voteCount,
            }, 'movie');
        }
        return movie;
    }

    public async GetMovieByTitle(title: string): Promise<Movie> {
        if(title.indexOf('\'') !== -1) {
            title = title.replace(/'/g, '') // database doesnt like ' inside their queries
        }
        let query = ogmneo.Query
            .create('movie')
            .where(
                new ogmneo.Where('title', { $eq: title })
            );
        return await ogmneo.Node.findOne(query);
    }

    private async findRelation(node1, node2, relation): Promise<any> {
        let query = ogmneo.RelationQuery.create(relation)
            .startNode(node1.id)
            .endNode(node2.id);
        return await ogmneo.Relation.find(query);
    }

    public async SetLanguages(movie: Movie, languages: Language[]) {
        for (const language of languages) {
            let rel = await this.findRelation(movie, language, 'mov_lan');
            if(rel[0] === undefined) {
                await ogmneo.Relation.relate(movie.id, 'mov_lan', language.id);
            }
        }
    }

    public async SetGenres(movie: Movie, genres: Genre[]) {
        for (const genre of genres) {
            let rel = await this.findRelation(movie, genre, 'mov_gen');
            if(rel[0] === undefined) {
                await ogmneo.Relation.relate(movie.id, 'mov_gen', genre.id);
            }
        }
    }

    public async SetCountries(movie: Movie, countries: Country[]) {
        for (const country of countries) {
            let rel = await this.findRelation(movie, country, 'mov_cou');
            if(rel[0] === undefined) {
                await ogmneo.Relation.relate(movie.id, 'mov_cou', country.id);
            }
        }
    }

    public async SetCollection(movie: Movie, collection: Collection) {
        if(!collection) {
            return;
        }
        let rel = await this.findRelation(movie, collection, 'mov_col');
        if(rel[0] === undefined) {
            await ogmneo.Relation.relate(movie.id, 'mov_col', collection.id);
        }
        rel = await this.findRelation(collection, movie, 'col_mov');
        if(rel[0] === undefined) {
            await ogmneo.Relation.relate(collection.id, 'col_mov', movie.id);
        }
    }

    public async SetCompanies(movie: Movie, companies: Company[]) {
        for (const company of companies) {
            let rel = await this.findRelation(movie, company, 'mov_com');
            if(rel[0] === undefined) {
                await ogmneo.Relation.relate(movie.id, 'mov_com', company.id);
            }
            rel = await this.findRelation(company, movie, 'com_mov');
            if(rel[0] === undefined) {
                await ogmneo.Relation.relate(company.id, 'com_mov', movie.id);
            }
        }
    }

}
