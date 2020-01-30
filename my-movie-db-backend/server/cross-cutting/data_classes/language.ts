import {Column, Entity} from 'typeorm';
import {EntityBase}                             from './entity-base';

@Entity()
export class Language extends EntityBase {
    @Column({
        default: '',
        nullable: true,
    })
    public Code: string;
    @Column({
        unique: true,
    })
    public Name: string;
}
