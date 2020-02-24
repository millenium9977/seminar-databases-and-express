import mongoose, {Document, Schema} from 'mongoose';

export const LanguageSchemaName: string = 'Language';

export interface ILanguage extends Document{
    Code: string;
    Name: string;
}

export const LanguageSchema : Schema = new Schema({
    Code: {type: String},
    Name: {type: String, required: true},
});

export default mongoose.model<ILanguage>('Language', LanguageSchema);
