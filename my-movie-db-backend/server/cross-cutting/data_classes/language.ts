import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Language extends BaseEntity{
    @PrimaryGeneratedColumn()
    public Id: string;
    @Column({
        unique: true,
    })
    public Code: string;
    @Column()
    public Name: string;
}
