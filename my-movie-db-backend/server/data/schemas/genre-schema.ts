import mongoose, {Document, Schema} from 'mongoose';


export const GenreSchemaName: string = 'Genre';

export interface IGenre extends Document{
    Name: string;
}

export const GenreSchema: Schema = new Schema({
    Name: {type: String, required: true, unique: true},
});

export default mongoose.model<IGenre>(GenreSchemaName, GenreSchema);

