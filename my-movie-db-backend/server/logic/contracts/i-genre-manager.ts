import Genre from "../../cross-cutting/data_classes/genre";

export interface IGenreManager {
    GetGenreByName(search: string): Genre
    SaveGenre(genre: Genre): Genre
}