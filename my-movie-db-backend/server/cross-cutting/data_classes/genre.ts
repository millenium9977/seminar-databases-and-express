import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Genre extends BaseEntity{
    @PrimaryGeneratedColumn()
    public Id: string;
    @Column({
        unique: true,
    })
    public Name: string;
}
