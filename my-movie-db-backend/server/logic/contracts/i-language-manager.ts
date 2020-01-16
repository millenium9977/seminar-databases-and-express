import {Language} from "../../cross-cutting/data_classes/language";

export interface ILanguageManager {
    GetLanguageByName(search: string): Language
    SaveLanguage(language: Language): Language
}