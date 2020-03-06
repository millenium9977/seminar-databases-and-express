import mongoose, {Schema, Document}        from 'mongoose';
import {CollectionSchema, CollectionSchemaName, ICollection} from './collection-schema';
import {ILanguage, LanguageSchema, LanguageSchemaName} from './language-schema';
import {CompanySchema, CompanySchemaName, ICompany} from './company-schema';
import {CountrySchema, CountrySchemaName, ICountry} from './country-schema';
import {GenreSchema, GenreSchemaName, IGenre} from './genre-schema';

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
    ProductionCompanies: ICompany[];
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
    Collection: {type: CollectionSchema, required: false},
    Budget: Number,
    Genres: [{type: GenreSchema, required: false}],
    Homepage: String,
    OriginalLanguage: String,
    OriginalTitle: String,
    Overview: String,
    Popularity: Number,
    ProductionCompanies: [{type: CompanySchema, required: false}],
    ProductionCountries: [{type: CountrySchema, required: false}],
    ReleaseDate: String,
    Revenue: Number,
    Runtime: Number,
    Spoken_Languages: [{type: LanguageSchema, required: false}],
    Status: String,
    Tagline: String,
    Title: {type: String, required: true, unique: true},
    Video: String,
    AverageVote: Number,
    VoteCount: Number,
});

export default mongoose.model<IMovieMetadata>(MovieMetadataSchemaName, MovieMetadataSchema);
