import axios from 'axios';
import {parse, HTMLElement, valid} from 'node-html-parser';
import { Episode, Instance, MovieType, PreviewMovie, QuickMovie, Season, Translation, VideoProps, VideoQuality } from '../utils/types';

export class Movie extends PreviewMovie {
  private get getCdnSeries(): URL {
    return new URL('ajax/get_cdn_series/', `https://${this.host}`);
  }

  public translators: Translation[] = [];
  private constructor(
    public id: string,
    public name: string,
    public url: string,
    public thumbnail: string,
    public type: MovieType,
    public originalName: string,
    public description: string,
    public host: string,
    public PHPSESSID: string[],
    public favs: string,
  ) {
    super(id, name, url, true, thumbnail, type);
  }

  static async get(url: string): Promise<Movie> {
    const res = await axios.get(url, {withCredentials: true});
    const html = res.data;
    if (!valid(html)) throw new Error('get() invalid HTML');
    const dom = parse(html);
    const id = dom.getElementById('post_id')!.getAttribute('value')!;
    const name = Movie.getDOMMetaparam(dom, 'title');
    const desc = dom.querySelector('.b-post__description_text')!.textContent!;
    const type = Movie.getPathname(url);
    const thumbnailUrl = Movie.getDOMMetaparam(dom, 'image');
    const favs = dom.getElementById('ctrl_favs')!.getAttribute('value')!;
    const originalName = dom.querySelector(
      'div[itemprop="alternativeHeadline"]',
    )!.textContent!;
    const cookies = res.headers['set-cookie']!.map(x => x.split(' ')[0]);
    cookies.push('getinfo=1');
    const translatorList = dom.getElementById('translators-list');
    const movie = new Movie(
      id,
      name,
      url,
      thumbnailUrl,
      type,
      originalName,
      desc,
      new URL(url).host,
      cookies,
      favs,
    );
    if (translatorList) {
      movie.translators.push(
        ...translatorList.getElementsByTagName('li').map<Translation>(x => ({
          id: x.getAttribute('data-translator_id')!,
          name: x.textContent!.trim(),
          is_ads: x.getAttribute('data-ads'),
          is_camrip: x.getAttribute('data-camrip'),
          is_director: x.getAttribute('data-director'),
        })),
      );
    } else {
      let translationId = '0';
      const translationRegex = /(?:sof\.tv\.\w+)(?:\(\d+, (\d+))/;
      const scripts = dom.getElementsByTagName('script');
      for (const script of scripts) {
        const scrText = script.textContent?.match(translationRegex);
        if (scrText) {
          translationId = scrText[1];
          break;
        }
      }
      const elements = dom.querySelectorAll('.b-post__info > tr > td');
      for (let i = 0; i < elements.length - 1; i += 2) {
        const prop = elements[i].textContent;
        if (!prop.includes('В переводе')) continue;
        const translationName = elements[i + 1].textContent!;
        movie.translators.push({id: translationId, name: translationName});
      }
      if (movie.translators.length == 0)
        movie.translators.push({id: translationId, name: 'Default'});
    }
    return movie;
  }

  public static async quickSearch(
    host: string,
    query: string,
  ): Promise<QuickMovie[]> {
    try {
      const url = new URL('/engine/ajax/search.php', host);
      const res = await axios.post(
        url.toString(),
        {q: query},
        {withCredentials: true},
      );
      const dom = parse(res.data);
      const qmovies = dom.querySelectorAll('li > a').map<QuickMovie>(x => ({
        enabled: true,
        id: 'Quick search ID',
        name: x.textContent!,
        url: x.getAttribute('href')!,
      }));
      return qmovies;
    } catch (err) {
      console.error('Quick seach error:', err);
      return [];
    }
  }

  public static async search(
    host: string,
    query: string,
    page: number,
  ): Promise<PreviewMovie[]> {
    const url = new URL('search/', `https://${host}`);
    url.searchParams.append('do', 'search');
    url.searchParams.append('subaction', 'search');
    url.searchParams.append('q', query);
    url.searchParams.append('page', page.toString());
    const res = await axios.get(url.toString(), {withCredentials: true});
    const dom = parse(res.data);
    return dom
      .querySelectorAll('.b-content__inline_item')
      .map<PreviewMovie | null>(movieEl => {
        const cover = movieEl.querySelector('div.b-content__inline_item-cover');
        if (!cover) {
          console.warn("skip search no 'cover'", {host, query, page});
          return null;
        }
        const img = cover.querySelector('a > img');
        if (!img) {
          console.warn("skip search no 'img'", {host, query, page});
          return null;
        }
        return {
          enabled: true,
          id: movieEl.getAttribute('data-id')!,
          url: cover.querySelector('a')!.getAttribute('href')!,
          thumbnail: img.getAttribute('src')!,
          name: img.getAttribute('alt')!,
          type: cover.querySelector('span')!.classList.value[1] as MovieType,
        };
      })
      .filter(x => x !== null) as PreviewMovie[];
  }

  public async getTranslationSeries(translationId: string): Promise<boolean> {
    const translation = this.translators.find(x => x.id == translationId);
    if (!translation) {
      console.warn(
        'No translation with id ',
        translationId,
        'existing',
        this.translators,
      );
      return false;
    }
    const translationIndex = this.translators.indexOf(translation);
    const reqArgs: Record<string, string> = {
      id: this.id,
      translator_id: translation.id,
      action: 'get_episodes',
    };
    if (this.favs) reqArgs['favs'] = this.favs;
    if (translation.is_ads) reqArgs['is_ads'] = translation.is_ads;
    if (translation.is_camrip) reqArgs['is_camrip'] = translation.is_camrip;
    if (translation.is_director)
      reqArgs['is_director'] = translation.is_director;

    const res = await axios.post(this.getCdnSeries.toString(), reqArgs, {
      withCredentials: true,
      headers: {
        Cookie: this.PHPSESSID,
      },
    });
    if (!res.data.success) {
      console.warn(
        'getTranslationSeries could not retrieve series',
        translation,
        'RES',
        res.data,
      );
      return false;
    }
    const seasonsDOM = parse(res.data.seasons);
    const seasonPreviews = seasonsDOM
      .getElementsByTagName('li')
      .map<Instance>(x => ({
        id: x.getAttribute('data-tab_id')!,
        name: x.textContent,
      }));
    const dom = parse(res.data.episodes);
    translation.seasons = dom
      .getElementsByTagName('ul')
      .map<Season>((el, index) => {
        return {
          ...seasonPreviews[index],
          episodes: el.getElementsByTagName('li').map<Episode>(epEl => {
            return {
              id: epEl.getAttribute('data-episode_id')!,
              name: epEl.textContent!,
            };
          }),
          translation,
        };
      });
    this.translators[translationIndex] = translation;
    return true;
  }

  public async getMovieStreams(
    translation: Translation,
  ): Promise<VideoProps[]> {
    const res = await axios.post(
      this.getCdnSeries.toString(),
      {
        id: this.id,
        translator_id: translation.id,
        favs: this.favs,
        is_ads: translation?.is_ads ?? '0',
        is_director: translation?.is_director ?? '0',
        is_camrip: translation?.is_camrip ?? '0',
        action: 'get_movie',
      },
      {withCredentials: true, headers: {Cookie: this.PHPSESSID}},
    );
    if (!res.data?.success) {
      console.warn(
        'getMovie could not retrieve movie',
        translation,
        'RES(200)',
        res.data.toString().substring(0,200),
      );
      return [];
    }
    return Movie.parseCdnUrl(res.data.url);
  }

  public async getEpisodeStreams(
    season: string,
    episode: string,
    translationId: string,
  ): Promise<VideoProps[]> {
    const reqArgs = new URLSearchParams({
      id: this.id,
      translator_id: translationId,
      season,
      episode,
      action: 'get_stream',
    });
    if (this.favs) reqArgs.append('favs', this.favs);
    const url = new URL(this.getCdnSeries.toString());
    url.searchParams.append('t', Date.now().toString());
    const res = await axios.post(url.toString(), reqArgs.toString(), {
      withCredentials: true,
      headers: {Cookie: this.PHPSESSID},
    });
    if (!res.data.success) {
      console.warn(
        'getEpisodeStream could not retrieve stream',
        {season, episode, translationId},
        'REQ',
        res.data,
      );
      return [];
    }
    return Movie.parseCdnUrl(res.data.url);
  }

  private static parseCdnUrl(cdn: string): VideoProps[] {
    const decodedUrls = Movie.clearTrash(cdn);
    const decodedArr = decodedUrls.split(',');
    const finArr: VideoProps[] = [];
    for (let url of decodedArr) {
      const r = /\[(.*)\](.*) or (.*)/.exec(url);
      if (r?.[0] == null) continue;
      finArr.push({
        quality: r[1] as VideoQuality,
        ukrtelCdn: r[2],
        voidboostCdn: r[3],
      });
    }
    return finArr;
  }

  public static clearTrash(encoded: string): string {
    const trash = ['@', '#', '!', '^', '$'];
    const trashCodes = [];
    for (let i = 2; i < 4; i++) {
      for (let chars of Movie.generateCombinations(trash, i)) {
        trashCodes.push(chars.join(''));
      }
    }
    const arr = encoded.replaceAll('#h', '').split('//_//');
    let trashStr = arr.join('');
    for (let code of trashCodes) {
      const base = Buffer.from(code, 'ascii').toString('base64');
      trashStr = trashStr.replaceAll(base, '');
    }
    const fstr = Buffer.from(trashStr + '==', 'base64').toString('ascii');
    return fstr;
  }

  private static generateCombinations(
    elements: string[],
    length: number,
  ): string[][] {
    if (length === 1) return elements.map(element => [element]);
    const result: string[][] = [];
    const rest = Movie.generateCombinations(elements, length - 1);
    for (const element of elements) {
      for (const combination of rest) {
        result.push([element, ...combination]);
      }
    }
    return result;
  }

  private static getDOMMetaparam(el: HTMLElement, og: string): string {
    return el
      .querySelector(`meta[property="og:${og}"]`)
      ?.getAttribute('content')!;
  }

  private static getPathname(url: string): MovieType {
    if (!url) return 'none';
    const match = url.match(/\/\w+\.\w+\/(.+)\/(?:.+)\//);
    if (match) {
      return match[1] as MovieType;
    }
    return 'none';
  }
}
