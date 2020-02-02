import {injectable} from 'tsyringe';
import {Collection} from '../cross-cutting/data_classes/collection';
import ogmneo from "ogmneo/index";

@injectable()
export class CollectionManager {

    public async GetCollectionByName(name: string): Promise<Collection> {
        if(name.indexOf('\'') !== -1) {
            name = name.replace(/'/g, '') // database doesnt like ' inside their queries
        }
        let query = ogmneo.Query
            .create('collection')
            .where(
                new ogmneo.Where('name', { $eq: name })
            );
        return await ogmneo.Node.findOne(query);
    }

    public async GetOrSaveCollection(name: string): Promise<Collection> {
        if(name.indexOf('\'') !== -1) {
            name = name.replace(/'/g, '') // database doesnt like ' inside their queries
        }
        let collection: Collection;
        try {
            collection = await this.GetCollectionByName(name);
            if (collection.name) {
                return collection;
            }
        } catch (err) {
            collection = await ogmneo.Node.create({
                name: name
            }, 'collection');
        }
        return collection;
    }

}