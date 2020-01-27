import {singleton} from 'tsyringe';
import Country, {ICountry} from '../data/schemas/country-schema';
import mongoose from 'mongoose';
import logger from '../common/logger';
import {Company} from '../cross-cutting/data_classes/company';

@singleton()
export class CountryManager {

    public async GetCountryByName(name: string): Promise<ICountry> {
        return Country.findOne({Name: name});
    }

    public async CreateCountry(name: string, code: string): Promise<ICountry> {
        try {
            let country: ICountry = await Country.findOne({Name: name});
            if(!country) {
                country = new Country({
                    Name: name,
                    Code: code,
                });

                await country.save();
            }

            return country;
        } catch (err) {
            return Country.findOne({Name: name});
        }
    }

    public async CreateOrGetCountry(name: string, code: string): Promise<ICountry> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const opts = {session, new: true};
            let country: ICountry = await Country.findOne({Name: name}, opts);
            if (!country) {
                country = new Country({
                    Code: code,
                    Name: name,
                });
                await country.save(opts);
            }
            await session.commitTransaction();
            session.endSession();
            return country;
        } catch (err) {
            logger.error(err);
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    }
}
