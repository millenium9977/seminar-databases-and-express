import {Country} from './Country';
import {EntityBase} from './EntityBase';

export class Certification implements EntityBase
{
    public id: number;

    public certification: string;
    public meaning: string;

    public certifiedFor: Country;
}
