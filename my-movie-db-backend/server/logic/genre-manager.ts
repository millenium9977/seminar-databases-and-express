import {singleton} from 'tsyringe';
import Gerne, {IGenre} from '../data/schemas/genre-schema';

@singleton()
export class GenreManager {

    public async GetGenreByName(name: string): Promise<IGenre> {
        return Gerne.findOne({Name: name});
    }

    public async CreateGenre(name: string): Promise<IGenre> {
        const genre: IGenre = new Gerne({
            Name: name,
        });

        return genre.save();
    }
}
