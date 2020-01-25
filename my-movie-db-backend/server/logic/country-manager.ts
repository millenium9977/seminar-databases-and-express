import {Country} from '../cross-cutting/data_classes/country';
import {singleton} from 'tsyringe';

@singleton()
export class CountryManager {
    private _countries: Country[];

    constructor() {
        this._countries = [];
    }

    GetCountryByName(search: string): Country {
        return this._countries.find((c) => c.Name === search);
    }

    SaveCountry(country: Country): Country {
        if (!country) {
            return null;
        }

        this._countries.push(country);

        return country;
    }

}