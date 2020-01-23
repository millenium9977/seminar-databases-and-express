import {singleton} from 'tsyringe';
import Collection from '../cross-cutting/data_classes/collection';
import {ICollectionManager} from './contracts/i-collection-manager';


//TODO: has to be singleton until we have a database running in the background
@singleton()
export class CollectionManager implements ICollectionManager {
    //TODO: take the pain away asap
    private _collectionList: Collection[];

    constructor() {
        this._collectionList = [];
    }

    public GetCollectionByName(search: string): Collection {
        //TODO: replaced with database operation
        return this._collectionList.find((c) => c.Name === search);
    }

    public SaveCollection(collection: Collection): Collection {
        //TODO: replace with database operation
        this._collectionList.push(collection);
        return collection;
    }
}