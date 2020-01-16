import {Country} from "../../cross-cutting/data_classes/country";

export interface ICountryManager {
    GetCountryByName(search: string): Country
    SaveCountry(country: Country): Country
}