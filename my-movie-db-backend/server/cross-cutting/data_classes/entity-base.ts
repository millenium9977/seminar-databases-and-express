import {PrimaryGeneratedColumn} from 'typeorm';

export abstract class EntityBase {
    @PrimaryGeneratedColumn()
    public Id: string;
}
