import {Movie}                                from './movie';
import {Column, Entity, JoinTable, OneToMany} from 'typeorm';
import {EntityBase}                           from './entity-base';

@Entity()
export class Collection extends EntityBase {
    public static readonly MoviesProperty: string = 'Movies';

    @Column({unique: true})
    public Name: string;
    @OneToMany(type => Movie,
        movie => movie.Collection)
    @JoinTable()
    public Movies: Movie[];
}
