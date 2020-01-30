import {Language}                  from '../cross-cutting/data_classes/language';
import {singleton}                 from 'tsyringe';
import {getRepository, Repository} from 'typeorm';

@singleton()
export class LanguageManager {

    public async GetLanguageByName(name: string): Promise<Language> {
        return await getRepository(Language).findOne({Name: name});
    }

    public async SaveOrGetLanguage(name: string, code: string = ''): Promise<Language> {
        const repository: Repository<Language> = getRepository(Language);
        let language: Language;

        try {
            language = await repository.findOne({Name: name});
            if (language) {
                return language;
            }

            language = {
                Id: null,
                Name: name,
                Code: code,
            };

            language = await repository.save(language);
        } catch (err) {
            language = await repository.findOne({Name: name});
        }

        return language;
    }

}
