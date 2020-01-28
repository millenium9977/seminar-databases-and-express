import {MovieMetadata}                                                                       from './movie-metadata';
import {BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Collection extends BaseEntity {
    @PrimaryGeneratedColumn()
    public Id: string;
    @Column()
    public Name: string;
    @OneToMany(type => MovieMetadata,
        movie => movie.Collection)
    @JoinTable()
    public Movies: MovieMetadata[];
}
