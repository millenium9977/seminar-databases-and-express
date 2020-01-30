import {injectable}                from 'tsyringe';
import {Genre}                     from '../cross-cutting/data_classes/genre';
import {getRepository, Repository} from 'typeorm';

@injectable()
export class GenreManager {

    public async GetGenreByName(name: string): Promise<Genre> {
        return getRepository(Genre).findOne({Name: name});
    }

    public async GetOrSaveGenre(name: string): Promise<Genre> {
        const repository: Repository<Genre> = getRepository(Genre);
        let genre: Genre;

        try {
            genre = await repository.findOne({Name: name});
            if (genre) {
                return genre;
            }

            genre = {
                Id: null,
                Name: name,
            };
            genre = await repository.save(genre);
        } catch (err) {
            genre = await repository.findOne({Name: name});
        }

        return genre;
    }
}
