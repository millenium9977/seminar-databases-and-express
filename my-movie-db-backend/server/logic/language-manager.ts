import {Language}              from '../cross-cutting/data_classes/language';
import {singleton}             from 'tsyringe';
import DBLanguage, {ILanguage} from '../data/schemas/language-schema';


@singleton()
export class LanguageManager {

    public async GetLanguageByName(name: string): Promise<Language> {
        const result: ILanguage = await DBLanguage.findOne({Name: name});

        if(!result) {
            return null;
        }

        return {
            Id: result._id.toString(),
            Name: result.Name,
            Code: result.Code,
        };
    }

    public async SaveLanguage(language: Language): Promise<Language> {
        if (!language) {
            return null;
        }


        const dbLanguage: ILanguage = new DBLanguage({
            Code: language.Code,
            Name: language.Name,
        });

        await dbLanguage.save();

        return language;
    }

}