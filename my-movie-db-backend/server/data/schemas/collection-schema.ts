import {IMovieMetadata, MovieMetadataSchemaName} from './movie-metadata-schema';
import mongoose, {Document, Schema} from 'mongoose';


export const CollectionSchemaName: string = 'Collection';

export interface ICollection extends Document {
    Name: string;
    Movies: IMovieMetadata['_id'][];
}

export const CollectionSchema: Schema = new Schema({
    Name: {type: String, required: true},
    Movies: [{type: Schema.Types.ObjectId, ref: 'MovieMetadata', required: false}],
});

export default mongoose.model<ICollection>(CollectionSchemaName, CollectionSchema);
