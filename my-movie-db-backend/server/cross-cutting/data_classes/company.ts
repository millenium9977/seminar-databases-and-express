import {MovieMetadata}                                                             from './movie-metadata';
import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Company extends BaseEntity {
    @PrimaryGeneratedColumn()
    public Id: string;
    @Column()
    public Name: string;
    @ManyToMany(type => MovieMetadata,
        movie => movie.ProductionCompanies)
    @JoinTable()
    public Movies: MovieMetadata[];
}
