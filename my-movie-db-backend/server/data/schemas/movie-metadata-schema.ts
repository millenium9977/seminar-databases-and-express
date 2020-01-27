import mongoose, {Schema, Document}        from 'mongoose';
import {CollectionSchemaName, ICollection} from './collection-schema';
import {ILanguage, LanguageSchema}                  from './language-schema';
import {CompanySchemaName, ICompany} from './company-schema';
import {CountrySchema, ICountry}                    from './country-schema';
import {GenreSchema, IGenre}        from './genre-schema';

export const MovieMetadataSchemaName: string = 'MovieMetadata';

export interface IMovieMetadata extends Document {
    Adult: {type: Schema.Types.Boolean, sparse: true, required: false, default: true};
    Collection: ICollection['_id'];
    Budget: number;
    Genres: IGenre[];
    Homepage: string;
    OriginalLanguage: string;
    OriginalTitle: string;
    Overview: string;
    Popularity: number;
    ProductionCompanies: ICompany['_id'][];
    ProductionCountries: ICountry[];
    ReleaseDate: string;
    Revenue: number;
    Runtime: number;
    Spoken_Languages: ILanguage[];
    Status: string;
    Tagline: string;
    Title: string;
    Video: {type: Schema.Types.Boolean, required: false, };
    AverageVote: number;
    VoteCount: number;
}

export const MovieMetadataSchema: Schema = new Schema({
    Adult: Boolean,
    Collection: {type: Schema.Types.ObjectId, ref: CollectionSchemaName, required: false},
    Budget: Number,
    Genres: [{GenreSchema}],
    Homepage: String,
    OriginalLanguage: String,
    OriginalTitle: String,
    Overview: String,
    Popularity: Number,
    ProductionCompanies: [{type: Schema.Types.ObjectId, ref: CompanySchemaName, required: false}],
    ProductionCountries: [{type: CountrySchema, required: false}],
    ReleaseDate: String,
    Revenue: Number,
    Runtime: Number,
    Spoken_Languages: [{type: LanguageSchema}],
    Status: String,
    Tagline: String,
    Title: {type: String, required: true, unique: true},
    Video: String,
    AverageVote: Number,
    VoteCount: Number,
});

export default mongoose.model<IMovieMetadata>(MovieMetadataSchemaName, MovieMetadataSchema);
