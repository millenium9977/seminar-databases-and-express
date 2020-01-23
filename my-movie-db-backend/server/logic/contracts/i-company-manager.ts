import {Company} from '../../cross-cutting/data_classes/company';

export interface ICompanyManager {
    GetCompanyByName(search: string): Company

    SaveCompany(company: Company): Company
}