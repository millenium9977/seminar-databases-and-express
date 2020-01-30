import {Movie}                      from './movie';
import {Column, Entity, ManyToMany} from 'typeorm';
import {EntityBase}                 from './entity-base';

@Entity()
export class Company extends EntityBase {
    public static readonly MoviesProperty: string = 'Movies';

    @Column({
        unique: true,
    })
    public Name: string;
    @ManyToMany(type => Movie,
        movie => movie.ProductionCompanies)
    public Movies: Movie[];
}
