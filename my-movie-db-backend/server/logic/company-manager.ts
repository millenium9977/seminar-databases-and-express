import {singleton}                 from 'tsyringe';
import {Company}                   from '../cross-cutting/data_classes/company';
import {getRepository, Repository} from 'typeorm';

@singleton()
export class CompanyManager {
    public async GetCompanyByName(name: string): Promise<Company> {
        return await getRepository(Company).findOne({Name: name});
    }

    public async SaveOrGetCompany(name: string): Promise<Company> {
        const repository: Repository<Company> = getRepository(Company);
        let company: Company;

        try {
            company = await repository.findOne({Name: name});
            if (company) {
                return company;
            }

            company = {
                Id: null,
                Name: name,
                Movies: [],
            };

            company = await repository.save(company);
        } catch (err) {
            company = await repository.findOne({Name: name});
        }

        return company;
    }
}
