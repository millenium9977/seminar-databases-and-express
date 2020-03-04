import {injectable} from 'tsyringe';
import {Collection}                from '../cross-cutting/data_classes/collection';
import {getRepository, Repository} from 'typeorm';


@injectable()
export class CollectionManager {

    public async GetCollectionByName(name: string): Promise<Collection> {
        return await getRepository(Collection).findOne({Name: name});
    }

    public async GetOrSaveCollection(name: string): Promise<Collection> {
        const repository: Repository<Collection> = getRepository(Collection);
        let collection: Collection;

        try {
            collection = await repository.findOne({Name: name});
            if(collection) {
                return collection;
            }

            collection = await repository.save({
                Id: null,
                Name: name,
            });
        } catch (err) {
            collection = await repository.findOne({Name: name});
        }

        return collection;
    }
}
