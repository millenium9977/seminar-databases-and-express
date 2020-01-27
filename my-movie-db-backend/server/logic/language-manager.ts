import {singleton}             from 'tsyringe';
import Language, {ILanguage} from '../data/schemas/language-schema';


@singleton()
export class LanguageManager {

    public async GetLanguageByName(name: string): Promise<ILanguage> {
        return Language.findOne({Name: name});
    }

    public async CreateLanguage(code: string, name: string): Promise<ILanguage> {
        const result: ILanguage = await this.GetLanguageByName(name);
        if(result) {
            return  result;
        }

        const language: ILanguage = new Language({
            Name: name,
            Code: code,

        });

        return language.save();
    }

    public async SaveLanguage(language: ILanguage): Promise<ILanguage> {
        if (!language) {
            return null;
        }


        const dbLanguage: ILanguage = new Language({
            Code: language.Code,
            Name: language.Name,
        });

        await dbLanguage.save();

        return language;
    }

}
