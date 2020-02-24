import {singleton} from 'tsyringe';
import Genre, {IGenre} from '../data/schemas/genre-schema';
import mongoose from 'mongoose';
import logger from '../common/logger';

@singleton()
export class GenreManager {

    public async GetGenreByName(name: string): Promise<IGenre> {
        return Genre.findOne({Name: name});
    }

    public CreateGenreObject(name: string): IGenre {
        return new Genre( {
            Name: name
        });
    }

    public async CreateGenre(name: string): Promise<IGenre> {
        try {
            let genre: IGenre = await Genre.findOne({Name: name});
            if(!genre) {
                genre = new Genre({
                    Name: name,
                });

                await genre.save();
            }
            return genre;
        } catch (err) {
            return Genre.findOne({Name: name});
        }

    }
    
    // public async CreateOrGetGenre(name: string): Promise<IGenre> {
    //     const session = await mongoose.startSession();
    //     session.startTransaction();
    //     try {
    //         const opts = {session, new: true};
    //         let genre: IGenre = await Genre.findOne({Name: name}, opts);
    //         if(!genre) {
    //             genre = new Genre({
    //                 Name: name,
    //             });
    //             await genre.save(opts);
    //         }
    //         await session.commitTransaction();
    //         session.endSession();
    //         return genre;
    //     } catch (err) {
    //         logger.error(err);
    //         await session.abortTransaction();
    //         session.endSession();
    //         throw err;
    //     }
    // }
}
