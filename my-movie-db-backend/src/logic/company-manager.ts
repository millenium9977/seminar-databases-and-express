import {singleton} from 'tsyringe';
import {Company} from '../cross-cutting/data_classes/company';
import ogmneo from "ogmneo/index";

@singleton()
export class CompanyManager {
    public async GetCompanyByName(name: string): Promise<Company> {
        if(name.indexOf('\'') !== -1) {
            name = name.replace(/'/g, '') // database doesnt like ' inside their queries
        }
        let query = ogmneo.Query
            .create('company')
            .where(
                new ogmneo.Where('name', { $eq: name })
            );
        return await ogmneo.Node.findOne(query);
    }

    public async SaveOrGetCompany(name: string): Promise<Company> {
        if(name.indexOf('\'') !== -1) {
            name = name.replace(/'/g, ''); // database doesnt like ' inside their queries
        }
        let company: Company;
        try {
            company = await this.GetCompanyByName(name);
            if (company.name) {
                return company;
            }
        } catch (err) {
            company = await ogmneo.Node.create({
                name: name
            }, 'company');
        }
        return company;
    }
}