import {ICountryManager} from "./contracts/i-country-manager";
import {Country} from "../cross-cutting/data_classes/country";
import {singleton} from "tsyringe";

@singleton()
export class CountryManager implements ICountryManager {
    private _countries: Country[];

    constructor() {
        this._countries = [];
    }

    GetCountryByName(search: string): Country {
        const country: Country = this._countries.find((c) => c.Name === search);
        return country;
    }

    SaveCountry(country: Country): Country {
        if(!country) {
            return null
        }

        this._countries.push(country);

        return country;
    }

}