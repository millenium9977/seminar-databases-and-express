import {singleton} from 'tsyringe';
import {Movie} from '../cross-cutting/data_classes/movie';
import {Collection} from '../cross-cutting/data_classes/collection';
import {Genre} from '../cross-cutting/data_classes/genre';
import {Country} from '../cross-cutting/data_classes/country';
import {Language} from '../cross-cutting/data_classes/language';
import {Company} from '../cross-cutting/data_classes/company';
import ogmneo from 'ogmneo/index';
import logger from '../common/logger';

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
            title = title.replace(/'/g, ''); // database doesnt like ' inside their queries
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

    public async GetMoviesByContainingValue(value: string): Promise<Array<Movie>> {
        let query = ogmneo.Query
            .create('movie').where(
                new ogmneo.Where('title', { $contains: value })
            );
        return ogmneo.Node.find(query);
    }


    public async DeleteMoviesByContainingValue(value: string) {
        let records = (await ogmneo.Cypher.transactionalWrite('MATCH (n:movie) WHERE n.title CONTAINS \'' + value + '\' DETACH DELETE n RETURN n')).records;
        return records.map( r => {
            return {
                id: r._fields[0].identity.low
            }
        });
    }

    public async GetMoviesByGenreByName(name: string): Promise<Array<Movie>> {
        let query = ogmneo.RelationQuery.create('mov_gen')
            .endNodeWhere(
                new ogmneo.Where('name', { $eq: name })
            );
        return (await ogmneo.Relation.findNodes(query, 'start') as Array<any>).map(node => node.start);
    }

    public async GetMoviesByLanguageByName(name: string): Promise<Array<Movie>> {
        let query = ogmneo.RelationQuery.create('mov_lan')
            .endNodeWhere(
                new ogmneo.Where('name', { $eq: name })
            );
        return (await ogmneo.Relation.findNodes(query, 'start') as Array<any>).map(node => node.start);
    }

    public async DeleteMoviesByLanguageByNameCypher(name: string): Promise<Array<any>> {
        let records = (await ogmneo.Cypher.transactionalWrite('MATCH (n1:movie)-[r:mov_lan]->(n2:language) WHERE n2.name = \'' + name + '\' DETACH DELETE n1 RETURN n1')).records;
        return records.map( r => {
            return {
                id: r._fields[0].identity.low
            }
        });
    }

    public async DeleteMoviesByGenreByNameCypher(name: string): Promise<Array<any>> {
        let records  = (await ogmneo.Cypher.transactionalWrite('MATCH (n1:movie)-[r:mov_gen]->(n2:genre) WHERE n2.name = \'' + name + '\' DETACH DELETE n1 RETURN n1')).records;
        return records.map( r => {
            return {
                id: r._fields[0].identity.low
            }
        });
    }

    public async ReplaceCharInMovieTitle(replacement: string, char: string): Promise<Array<Movie>> {
        let records  = (await ogmneo.Cypher.transactionalWrite('MATCH (n:movie) WHERE n.title CONTAINS \'' + char + '\' SET n.title = replace(n.title, \'' + char + '\', \'' + replacement + '\') RETURN n'));
        return records.map( r => {
            return {
                adult: r._fields[0].properties.adult,
                budget: r._fields[0].properties.budget,
                homepage: r._fields[0].properties.hompage,
                originalLanguage: r._fields[0].properties.originalLanguage,
                originalTitle: r._fields[0].properties.originalTitle,
                overview: r._fields[0].properties.overview,
                popularity: r._fields[0].properties.popularity,
                releaseDate: r._fields[0].properties.releaseDate,
                status: r._fields[0].properties.status,
                tagline: r._fields[0].properties.tagline,
                title: r._fields[0].properties.title,
                video: r._fields[0].properties.video,
                voteCount: r._fields[0].properties.voteCount,
                id: r._fields[0].identity.low
            }
        });
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
        return ogmneo.Node.findOne(query);
    }

    public async Movies(): Promise<Array<Movie>> {
        return await ogmneo.Node.find(ogmneo.Query.create('movie'));
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
