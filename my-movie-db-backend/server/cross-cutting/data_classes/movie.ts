import {Collection} from './collection';
import {Genre}      from './genre';
import {Company}    from './company';
import {Language}   from './language';
import {Country}    from './country';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
}                   from 'typeorm';
import {EntityBase} from './entity-base';

@Entity()
export class Movie extends EntityBase {
    public static readonly LanguagesProperty: string = 'Spoken_Languages';
    public static readonly CompaniesProperty: string = 'ProductionCompanies';
    public static readonly CountriesProperty: string = 'ProductionCountries';
    public static readonly GenresProperty: string    = 'Genres';

    @Column({default: false, nullable: true})
    public Adult: boolean;
    @ManyToOne(type => Collection,
        collection => collection.Id,
        {
            eager: true,
        })
    public Collection: Collection;
    @Column({nullable: true})
    public Budget: number;
    @ManyToMany(type => Genre,
        genre => genre.Id, {cascade: ['update']})
    @JoinTable()
    public Genres: Genre[];
    @Column({nullable: true})
    public Homepage: string;
    @Column({nullable: true})
    public OriginalLanguage: string;
    @Column({nullable: true})
    public OriginalTitle: string;
    @Column({nullable: true, type: 'mediumtext'})
    public Overview: string;
    @Column({nullable: true})
    public Popularity: number;
    @ManyToMany(type => Company,
        company => company.Movies,
        {
            cascade: ['update'],
        })
    @JoinTable()
    public ProductionCompanies: Company[];
    @ManyToMany(type => Country,
        country => country.Id)
    @JoinTable()
    public ProductionCountries: Country[];
    @Column({nullable: true})
    public ReleaseDate: string;
    @Column({nullable: true})
    public Revenue: number;
    @Column({nullable: true})
    public Runtime: number;
    @ManyToMany(type => Language,
        language => language.Id, {cascade: ['update']})
    @JoinTable()
    public Spoken_Languages: Language[];
    @Column({nullable: true})
    public Status: string;
    @Column({nullable: true, type: 'mediumtext'})
    public Tagline: string;
    @Column({nullable: false})
    public Title: string;
    @Column({default: false, nullable: true})
    public Video: boolean;
    @Column({default: 0, nullable: true})
    public AverageVote: number;
    @Column({default: 0, nullable: true})
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
