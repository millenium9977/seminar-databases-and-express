import {singleton}             from 'tsyringe';
import Company, {ICompany}     from '../data/schemas/company-schema';
import mongoose                from 'mongoose';
import logger                  from '../common/logger';
import Movie, {IMovieMetadata} from '../data/schemas/movie-metadata-schema';

@singleton()
export class CompanyManager {

    public async GetCompanyByName(name: string): Promise<ICompany> {
        return Company.findOne({Name: name});
    }

    public async CreateCompany(name: string): Promise<ICompany> {
        try {
            let company: ICompany = await Company.findOne({Name: name});
            if (!company) {
                company = new Company({
                    Name: name,
                    Movies: [],
                });

                await company.save();
            }

            return company;
        } catch (err) {
            return Company.findOne({Name: name});
        }
    }

    public createCompanyObject(name: string): ICompany {
        return new Company({
            Name: name,
            Movies: [],
        });
    }

    public async CreateOrGetCompany(name: string): Promise<ICompany> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const opts            = {session, new: true};
            let company: ICompany = await Company.findOne({Name: name}, opts);
            if (!company) {
                company = new Company({
                    Name: name,
                    Movies: [],
                });
                await company.save();
            }
            await session.commitTransaction();
            session.endSession();
            return company;
        } catch (err) {
            logger.error(err);
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    }

    public async FilterByMovieLang(lang: string): Promise<ICompany[]> {
        const movies: IMovieMetadata[] = await Movie.find({'Spoken_Languages.Name': lang});
        // logger.debug(movies.length.toString());
        let companies: ICompany[]    = [];
        for (const m of movies) {
            // logger.debug(m.ProductionCountries.length.toString());
            companies = companies.concat(m.ProductionCompanies);
        }
        return companies;
    }


    public async DeleteWithLang(lang: string): Promise<ICompany[]> {
        const companies: ICompany[] = await this.FilterByMovieLang(lang);
        for (const company of companies) {
            await company.remove();
        }
        return companies;
    }

    public async Companies(): Promise<any> {
        return await Company.find();
    }

    public async MoviesBudget(name: string): Promise<number> {
        const movies: IMovieMetadata[] = await Movie.find({'ProductionCompanies.Name': name});
        let sum = 0;
        movies.forEach(m => sum += m.Budget);
        return sum;
    }

}
