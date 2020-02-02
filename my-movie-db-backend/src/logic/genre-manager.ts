import {injectable} from 'tsyringe';
import {Genre} from '../cross-cutting/data_classes/genre';
import ogmneo from 'ogmneo/index.js';

@injectable()
export class GenreManager {

    public async GetGenreByName(name: string): Promise<Genre> {
        if(name.indexOf('\'') !== -1) {
            name = name.replace(/'/g, '') // database doesnt like ' inside their queries
        }
        let query = ogmneo.Query
            .create('genre')
            .where(
                new ogmneo.Where('name', { $eq: name })
            );
        return await ogmneo.Node.findOne(query);
    }

    public async GetOrSaveGenre(name: string): Promise<Genre> {
        if(name.indexOf('\'') !== -1) {
            name = name.replace(/'/g, '') // database doesnt like ' inside their queries
        }
        let genre: Genre;
        try {
            genre = await this.GetGenreByName(name);
            if (genre.name) {
                return genre;
            }
        } catch (err) {
            genre = await ogmneo.Node.create({
                name: name
            }, 'genre');
        }
        return genre;
    }

}