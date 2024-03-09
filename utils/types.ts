import config from '../config';
import {Movie} from '../logic/movie';

export type WatchTime = {
  secondsWatched: number;
  videoQuality: VideoQuality;
};
export type AsyncState = 'idle' | 'loading' | 'success' | 'fail' | 'notfound';
export type MovieType = 'none' | 'animation' | 'cartoons' | 'series' | 'films';

export type AppTheme = typeof config.themes[number];

export type VideoQuality =
  | 'none'
  | '360p'
  | '480p'
  | '720p'
  | '1080p'
  | '1080p Ultra';

export interface Instance {
  id: string;
  name: string;
}

export class Translation implements Instance {
  constructor(
    public id: string,
    public name: string,
    public is_director?: string,
    public is_ads?: string,
    public is_camrip?: string,
    public seasons?: Season[],
  ) {}
}

export interface VideoProps {
  quality: VideoQuality;
  ukrtelCdn: string;
  voidboostCdn: string;
}

export class Episode implements Instance {
  constructor(
    public id: string,
    public name: string,
    public cdnUrl?: string,
    public quality?: VideoQuality,
  ) {}
}

export class Season implements Instance {
  constructor(
    public id: string,
    public name: string,
    public episodes: Episode[],
    public translation: Translation,
  ) {}
}

export class QuickMovie implements Instance {
  constructor(
    public id: string,
    public name: string,
    public url: string,
    public enabled: boolean,
  ) {}
}

export class PreviewMovie implements QuickMovie {
  constructor(
    public id: string,
    public name: string,
    public url: string,
    public enabled: boolean,
    public thumbnail: string,
    public type: MovieType,
  ) {}
}

export class HistoryMovie extends PreviewMovie {
  constructor(
    public id: string,
    public name: string,
    public url: string,
    public thumbnail: string,
    public type: MovieType,
    public watchedSeconds: number,
    public watchedTranslation: Translation,
    public watchTime: WatchTime,
    public lastWatched: number,
    public watchedSeason?: Season,
    public watchedEpisode?: Episode,
  ) {
    super(id, name, url, true, thumbnail, type);
  }
}

export class Speed {
  _x: number;
  public get x() {
    return `x${this._x}`;
  }
  constructor(x: number) {
    this._x = x;
  }
}

export type NavigationProps = {
  main: {search?: boolean} | undefined;
  sub: {query: string; page?: number} | undefined;
  mov: {link: string} | undefined;
  watch:
    | {
        movie: Movie;
        translation: Translation;
        season?: Season;
        episode?: Episode;
        watchTime?: WatchTime;
      }
    | undefined;
  mov2:
    | {
        link: string;
        translation?: Translation;
        season?: Season;
        episode?: Episode;
      }
    | undefined;
};
