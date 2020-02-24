import mongoose, {Document, Schema}              from 'mongoose';
import {IMovieMetadata, MovieMetadataSchemaName} from './movie-metadata-schema';

export const CompanySchemaName: string = 'Company';

export interface ICompany extends Document {
    Name: string;
    Movies: IMovieMetadata['_id'][];
}

export const CompanySchema: Schema = new Schema({
    Name: {type: String, required: true, unique: true},
    Movies: [{type: Schema.Types.ObjectId, ref: 'MovieMetadata', required: false}],
});

export default mongoose.model<ICompany>(CompanySchemaName, CompanySchema);