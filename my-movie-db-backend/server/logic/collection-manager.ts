import {singleton} from 'tsyringe';
import Collection, {ICollection} from '../data/schemas/collection-schema';
import mongoose from 'mongoose';
import logger from '../common/logger';

@singleton()
export class CollectionManager {

    public async GetCollectionByName(name: string): Promise<ICollection> {
        return Collection.findOne({Name: name});
    }

    public async CreateCollection(name: string): Promise<ICollection> {
        try {
            let collection: ICollection = await Collection.findOne({Name: name});
            if(!collection) {
                collection = new Collection({
                    Name: name,
                    Movies: [],
                });

                await collection.save();
            }

            return collection;
        } catch (err) {
            return Collection.findOne({Name: name});
        }
    }

    public async CreateOrGetCollection(name: string): Promise<ICollection> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const opts = { session, new: true};
            let collection: ICollection = await Collection.findOne({Name: name}, opts);
            if (!collection) {
                collection = new Collection({
                    Name: name,
                    Movies: [],
                });
                await collection.save(opts);
            }
            await session.commitTransaction();
            session.endSession();
            return collection;
        } catch (err) {
            logger.error(err) ;
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    }
}
