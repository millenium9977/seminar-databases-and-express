import {singleton}                       from 'tsyringe';
import {Company}                         from '../cross-cutting/data_classes/company';
import {getRepository, Like, Repository} from 'typeorm';

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

            company = await repository.save({
                Id: null,
                Name: name,
            });
        } catch (err) {
            company = await repository.findOne({Name: name});
        }

        return company;
    }

    public async MoviesBudget(name: string): Promise<number> {
        const repository: Repository<Company> = getRepository(Company);
        const company: Company                = await repository
            .findOne({where: {Name: Like(`%${name}%`)}, relations: [Company.MoviesProperty]});

        let sum = 0;
        company.Movies.forEach((m) => sum += m.Budget);

        return sum;
    }

    public async Companies(): Promise<Company[]> {
        return getRepository(Company).find();
    }

    public async CompaniesByLang(lang: string): Promise<Company[]> {
        const repository: Repository<Company> = getRepository(Company);
        return repository
            .createQueryBuilder('company')
            .leftJoinAndSelect('company.Movies', 'movie')
            .leftJoin('movie.Spoken_Languages', 'language')
            .where('language.Name = :lang', {lang: lang})
            .getMany();
    }

    public async DeleteByMovieLang(lang: string) {
        const repository: Repository<Company> = getRepository(Company);
        const companies                       = await this.CompaniesByLang(lang);
        return repository.remove(companies);
    }
}
