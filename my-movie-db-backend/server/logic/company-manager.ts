import {singleton} from 'tsyringe';
import {Company}   from '../cross-cutting/data_classes/company';
import DBComapany, {ICompany}  from '../data/schemas/company-schema';

@singleton()
export class CompanyManager {

    public async GetCompanyByName(name: string): Promise<Company> {
        const result : ICompany = await DBComapany.findOne({Name: name});

        if(! result) {
            return null;
        }

        return {
            Id: result._id,
            Name:
        };
    }

    public async SaveCompany(company: Company): Promise<Company> {
        if (!company) {
            return null;
        }

        const dbCompany: ICompany = new DBComapany({
            Name: company.Name,
        });

        await dbCompany.save();
        return company;
    }
}