import {Language} from "../cross-cutting/data_classes/language";
import {ILanguageManager} from "./contracts/i-language-manager";
import {singleton} from "tsyringe";

@singleton()
export class LanguageManager implements ILanguageManager{
    private _languages: Language[];

    constructor() {
        this._languages = [];
    }


    public GetLanguageByName(search: string): Language {
        const language: Language = this._languages.find((l) => l.Name === search);
        return language;
    }

    public SaveLanguage(language: Language): Language {
        if(!language) {
            return null;
        }

        this._languages.push(language);

        return language;
    }

}