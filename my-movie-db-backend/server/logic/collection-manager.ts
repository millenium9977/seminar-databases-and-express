import {singleton} from 'tsyringe';
import Collection, {ICollection} from '../data/schemas/collection-schema';

@singleton()
export class CollectionManager {


    public async GetCollectionByName(name: string): Promise<ICollection> {
        return Collection.findOne({Name: name});
    }

    public async CreateCollection(name: string): Promise<ICollection> {
        const collection: ICollection = new Collection({
            Name: name,
            Movies: [],
        });

        return collection.save();
    }
}
