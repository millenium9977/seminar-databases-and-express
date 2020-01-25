import Collection from '../../cross-cutting/data_classes/collection';
import collection from '../../cross-cutting/data_classes/collection';

export interface ICollectionManager {
    GetCollectionByName(search: string): Collection

    SaveCollection(collection: collection): Collection
}
