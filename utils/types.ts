import { Episode, Movie, Season, Translation } from "../logic/movie";

export type AsyncState = 'idle' | 'loading' | 'success' | 'fail' | 'notfound';

export type NavigationProps = {
    main: { search?: boolean } | undefined;
    sub: { query: string; page?: number } | undefined;
    mov: { link: string } | undefined;
    watch:
    | {
        movie: Movie;
        translation: Translation;
        season?: Season;
        episode?: Episode;
    }
    | undefined;
    mov2: { 
        link: string;
        translation?: Translation;
        season?: Season;
        episode?: Episode;
    } | undefined;
};