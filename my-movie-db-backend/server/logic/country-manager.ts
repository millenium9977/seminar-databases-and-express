import {Country}                   from '../cross-cutting/data_classes/country';
import {singleton}                 from 'tsyringe';
import {getRepository, Repository} from 'typeorm';
import logger                      from '../common/logger';

@singleton()
export class CountryManager {

    public async GetCountryByName(search: string): Promise<Country> {
        return await getRepository(Country).findOne({Name: name});
    }

    public async SaveOrGetCountry(name: string, code: string = ''): Promise<Country> {
        const repository: Repository<Country> = getRepository(Country);
        let country: Country;

        try {
            country = await repository.findOne({Name: name});
            if(country) {
                return country;
            }

            country = {
                Id: null,
                Name: name,
                Code: code,
            };

            country = await repository.save(country);
        } catch (err) {
            logger.debug('Maybe now the country manager catched the shit');
            logger.error(err);
            country = await repository.findOne({Name: name});
        }

        return country;
    }

}
