import {Language} from '../cross-cutting/data_classes/language';
import {singleton} from 'tsyringe';
import ogmneo from "ogmneo/index";

@singleton()
export class LanguageManager {

    public async GetLanguageByName(name: string): Promise<Language> {
        if(name.indexOf('\'') !== -1) {
            name = name.replace(/'/g, '') // database doesnt like ' inside their queries
        }
        let query = ogmneo.Query
            .create('language')
            .where(
                new ogmneo.Where('name', { $eq: name })
            );
        return await ogmneo.Node.findOne(query);
    }

    public async SaveOrGetLanguage(name: string, code: string = ''): Promise<Language> {
        if(name.indexOf('\'') !== -1) {
            name = name.replace(/'/g, '') // database doesnt like ' inside their queries
        }
        let language: Language;
        try {
            language = await this.GetLanguageByName(name);
            if (language.name) {
                return language;
            }
        } catch (err) {
            language = await ogmneo.Node.create({
                name: name,
                code: code
            }, 'language');
        }
        return language;
    }

}