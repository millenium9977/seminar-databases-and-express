import {singleton} from 'tsyringe';
import Comapany, {ICompany} from '../data/schemas/company-schema';

@singleton()
export class CompanyManager {

    public async GetCompanyByName(name: string): Promise<ICompany> {
        return Comapany.findOne({Name: name});
    }

    public async CreateCompany(name: string): Promise<ICompany> {
        const company: ICompany = new Comapany({
            Name: name,
            Movies: [],
        });

        return company.save();
    }
}
