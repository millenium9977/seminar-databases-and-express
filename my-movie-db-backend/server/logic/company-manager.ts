import {singleton} from 'tsyringe';
import Comapany, {ICompany} from '../data/schemas/company-schema';
import mongoose from 'mongoose';
import logger from '../common/logger';

@singleton()
export class CompanyManager {

    public async GetCompanyByName(name: string): Promise<ICompany> {
        return Comapany.findOne({Name: name});
    }

    public async CreateCompany(name: string): Promise<ICompany> {
        try {
            let company: ICompany = await Comapany.findOne({Name: name});
            if (!company) {
                company = new Comapany({
                    Name: name,
                    Movies: [],
                });

                await company.save();
            }

            return company;
        } catch (err) {
            return Comapany.findOne({Name: name});
        }
    }

    public async CreateOrGetCompany(name: string): Promise<ICompany> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const opts = {session, new: true};
            let company: ICompany = await Comapany.findOne({Name: name}, opts);
            if (!company) {
                company = new Comapany({
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
}
