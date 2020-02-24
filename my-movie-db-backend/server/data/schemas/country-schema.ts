import mongoose, {Document, Schema} from 'mongoose';

export const CountrySchemaName: string = 'Country';

export interface ICountry extends Document {
    Code: string;
    Name: string;
}

export const CountrySchema: Schema = new Schema({
    Code: {type: String},
    Name: {type: String, required: true},
});

export default mongoose.model<ICountry>(CountrySchemaName, CountrySchema);

