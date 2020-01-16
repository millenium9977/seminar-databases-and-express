import {singleton} from "tsyringe";
import {Company} from "../cross-cutting/data_classes/company";
import {ICompanyManager} from "./contracts/i-company-manager";

@singleton()
export class CompanyManager implements ICompanyManager {
    private _companies: Company[];

    constructor() {
        this._companies = []
    }

    public GetCompanyByName(search: string): Company {
        const company: Company = this._companies.find((p) => p.Name === search);

        return company;
    }

    public SaveCompany(company: Company): Company {
        if(!company) {
            return null;
        }

        this._companies.push(company);

        return company;
    }
}