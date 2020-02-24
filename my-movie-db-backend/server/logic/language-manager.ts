import {singleton} from 'tsyringe';
import Language, {ILanguage} from '../data/schemas/language-schema';
import mongoose from 'mongoose';
import logger from '../common/logger';

@singleton()
export class LanguageManager {

    public async GetLanguageByName(name: string): Promise<ILanguage> {
        return Language.findOne({Name: name});
    }

    public async CreateLanguage(name: string, code: string): Promise<ILanguage> {
        try {
            let language: ILanguage = await Language.findOne({Name: name});
            if(!language) {
                language = new Language({
                    Name: name,
                    Code: code,
                });
                await language.save();
            }

            return language;
        } catch (e) {
            return Language.findOne({Name: name});
        }

    }

    public CreateLanguageObject(name: string, code: string): ILanguage {
        return new Language({
            Name: name,
            Code: code,
        });
    }

    // public async CreateOrGetLanguage(name: string, code: string): Promise<ILanguage> {
    //     const session = await mongoose.startSession();
    //     session.startTransaction();
    //     try {
    //         const opts = {session, new: true};
    //         let language: ILanguage = await Language.findOne({Name: name}, opts);
    //         if (!language) {
    //             language = new Language({
    //                 Name: name,
    //                 Code: code,
    //             });
    //             await language.save(opts);
    //         }
    //         await session.commitTransaction();
    //         session.endSession();
    //         return language;
    //     } catch (err) {
    //         logger.error(err);
    //         await session.abortTransaction();
    //         session.endSession();
    //         throw err;
    //     }
    // }

}
