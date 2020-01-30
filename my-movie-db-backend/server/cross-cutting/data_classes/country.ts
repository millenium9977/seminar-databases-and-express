import {BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Movie}                                                          from './movie';
import {EntityBase}                                                     from './entity-base';

@Entity()
export class Country extends EntityBase{
    @Column({
        nullable: true,
        default: '',
    })
    public Code: string;
    @Column(
        {unique: true}
    )
    public Name: string;
}
