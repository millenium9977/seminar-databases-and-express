import MovieMetadata from "../../cross-cutting/data_classes/movie-metadata";

export interface IMovieMdManager {
    SaveMovie(movie: MovieMetadata): MovieMetadata
}