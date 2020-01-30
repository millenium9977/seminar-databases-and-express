import {Column, Entity} from 'typeorm';
import {EntityBase}     from './entity-base';

@Entity()
export class Genre extends EntityBase {
    @Column({
        unique: true,
    })
    public Name: string;

}
