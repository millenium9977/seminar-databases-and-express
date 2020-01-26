import {singleton} from 'tsyringe';
import Country, {ICountry} from '../data/schemas/country-schema';

@singleton()
export class CountryManager {

    public async GetCountryByName(name: string): Promise<ICountry> {
        return Country.findOne({Name: name});
    }

    public async CreateCountry(name: string, code: string): Promise<ICountry> {
        const country: ICountry = new Country({
            Code: code,
            Name: name,
        });

        return country.save();
    }
}
