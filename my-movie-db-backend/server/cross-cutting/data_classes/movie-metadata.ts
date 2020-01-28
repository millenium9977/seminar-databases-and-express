import {Collection}                                                     from './collection';
import {Genre}                                                          from './genre';
import {Company}                                                        from './company';
import {Language}                                                       from './language';
import {Country}                                                        from './country';
import {BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class MovieMetadata extends BaseEntity {
    @PrimaryGeneratedColumn()
    public Id: string;
    @Column()
    public Adult: boolean;
    public Collection: Collection;
    public Budget: number;
    public Genres: Genre[];
    public Homepage: string;
    public OriginalLanguage: string;
    public OriginalTitle: string;
    public Overview: string;
    public Popularity: number;
    @ManyToMany(type => Company,
        company => company.Movies)
    public ProductionCompanies: Company[];
    public ProductionCountries: Country[];
    public ReleaseDate: string;
    public Revenue: number;
    public Runtime: number;
    public Spoken_Languages: Language[];
    public Status: string;
    public Tagline: string;
    public Title: string;
    public Video: string;
    public AverageVote: number;
    public VoteCount: number;

    ToString(): String {
        return '\nId: ' + this.Id + '\n' +
            'Adult: ' + this.Adult + '\n' +
            'Collection: ' + this.Collection + '\n' +
            'Budget: ' + this.Budget + '\n' +
            'Genres: ' + JSON.stringify(this.Genres) + '\n' +
            'Homepage: ' + this.Homepage + '\n' +
            'OriginalLanguage: ' + this.OriginalLanguage + '\n' +
            'OriginalTitle: ' + this.OriginalTitle + '\n' +
            'Overview: ' + this.Overview + '\n' +
            'Popularity: ' + this.Popularity + '\n' +
            'First ProductionCompanies (throws exception because of circular structure): ' + this.ProductionCompanies[0].Name + '\n' +
            'ProductionCountries: ' + JSON.stringify(this.ProductionCountries) + '\n' +
            'ReleaseDate: ' + this.ReleaseDate + '\n' +
            'Revenue: ' + this.Revenue + '\n' +
            'Runtime: ' + this.Runtime + '\n' +
            'Spoken_Language: ' + JSON.stringify(this.Spoken_Languages) + '\n' +
            'Status: ' + this.Status + '\n' +
            'Tagline: ' + this.Tagline + '\n' +
            'Title: ' + this.Title + '\n' +
            'Video: ' + this.Video + '\n' +
            'AverageVote: ' + this.AverageVote + '\n' +
            'VoteCount: ' + this.VoteCount;
    }

}
