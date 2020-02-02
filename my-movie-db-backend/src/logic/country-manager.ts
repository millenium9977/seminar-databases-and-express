import {Country} from '../cross-cutting/data_classes/country';
import {singleton} from 'tsyringe';
import ogmneo from "ogmneo/index";

@singleton()
export class CountryManager {

    public async GetCountryByName(name: string): Promise<Country> {
        if(name.indexOf('\'') !== -1) {
            name = name.replace(/'/g, '') // database doesnt like ' inside their queries
        }
        let query = ogmneo.Query
            .create('country')
            .where(
                new ogmneo.Where('name', { $eq: name })
            );
        return await ogmneo.Node.findOne(query);
    }

    public async SaveOrGetCountry(name: string, code: string = ''): Promise<Country> {
        if(name.indexOf('\'') !== -1) {
            name = name.replace(/'/g, '') // database doesnt like ' inside their queries
        }
        let country: Country;
        try {
            country = await this.GetCountryByName(name);
            if (country.name) {
                return country;
            }
        } catch (err) {
            country = await ogmneo.Node.create({
                name: name
            }, 'country');
        }
        return country;
    }

}