import axios from 'axios';
import {parse, HTMLElement, valid} from 'node-html-parser';
class Dictionary<T> {
  [Key: string]: T;
}

export type MovieType = 'none' | 'animation' | 'cartoons' | 'series' | 'films';

export type VideoQuality =
  | 'none'
  | '360p'
  | '480p'
  | '720p'
  | '1080p'
  | '1080p Ultra';

export class Instance {
  id: string;
  name: string;
  constructor(id: string = 'Instance ID', name: string = 'Instance Name') {
    this.id = id;
    this.name = name;
  }
}
export type Rating = {
  score: number;
  name: string;
};
export interface VideoProps {
  quality: VideoQuality;
  url: string;
}
class Episode extends Instance {
  cdnUrl: string;
  quality: VideoQuality;
  constructor(cdnUrl: string, quality: VideoQuality) {
    super();
    this.name = 'Episode';
    this.cdnUrl = cdnUrl;
    this.quality = quality;
  }
}
class Season extends Instance {
  translation: Instance;
  episodes: Episode[];
  constructor(episodes: Episode[], translation: Instance) {
    super();
    this.name = 'Season';
    this.episodes = episodes;
    this.translation = translation;
  }
}

export class QuickMovie extends Instance {
  url: string;
  enabled: boolean;
  constructor(url: string, enabled: boolean) {
    super();
    this.url = url;
    this.enabled = enabled;
  }
}
export class PreviewMovie extends QuickMovie {
  thumbnail: string;
  type: MovieType;
  constructor(
    url: string,
    enabled: boolean,
    thumbnail: string,
    type: MovieType,
  ) {
    super(url, enabled);
    this.thumbnail = thumbnail;
    this.type = type;
  }
}

export class Movie extends PreviewMovie {
  originalName: string;
  ratings: Rating[];
  description: string;
  releaseDate?: string;
  translators: Instance[];
  favs: string;
  constructor(html: string) {
    super('', true, '', 'none');
    const dom = parse(html);
    this.url = getDOMMetaparam(dom, 'url');
    this.type = getPathname(this.url);
    this.thumbnail = getDOMMetaparam(dom, 'image');
    this.id = dom.getElementById('post_id')?.getAttribute('value')!;
    this.name = getDOMMetaparam(dom, 'title');
    this.description = getDOMMetaparam(dom, 'description');
    this.favs = dom.getElementById('ctrl_favs').getAttribute('value')!;
    // this.props = new Dictionary();
    // const filmInfo = dom.querySelectorAll(".b-post__info > tr > td");
    // console.log('filmInfo',filmInfo.length);
    // for (let i = 0; i < filmInfo.length - 1; i += 2) {
    //   const prop = filmInfo[i].textContent!;
    //   const val = filmInfo[i + 1];
    //   this.props[prop] = val;
    // }

    this.originalName = dom.querySelector(
      'div[itemprop="alternativeHeadline"]',
    )?.textContent!;
    this.ratings = [];
    // this.releaseDate = this.props['Дата выхода:'].textContent;
    // this.props["Рейтинги:"]
    //   ?.querySelectorAll("span.b-post__info_rates")
    //   .forEach((x:HTMLElement) =>
    //     this.ratings.push({
    //       name: x.querySelector("a")?.textContent!,
    //       score: Number(x.querySelector(".bold")!.textContent),
    //     })
    //   );
    const translators = dom.getElementById('translators-list')!;
    if (translators) {
      const list = translators.querySelectorAll('li');
      const retList: Instance[] = [];
      list.forEach(x => {
        retList.push({
          id: x.getAttribute('data-translator_id')!,
          name: x.textContent!.trim(),
        });
      });
      this.translators = retList;
    } else {
      this.translators = [];
      let translationId: string = '0';
      const translationRegex = /(?:sof\.tv\.\w+)(?:\(\d+, (\d+))/;
      const scripts = dom.querySelectorAll(
        'script',
      ) as unknown as HTMLElement[];
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
        this.translators.push({id: translationId, name: translationName});
      }
      if (this.translators.length == 0)
        this.translators.push({id: translationId, name: 'No translation name'});
    }
  }
}
function getPathname(url: string): MovieType {
  const match = url.match(/\/\w+\.\w+\/(.+)\/(?:.+)\//);
  if (match) {
    return match[1] as MovieType;
  }
  return 'none';
}
function getDOMMetaparam(el: HTMLElement, og: string): string {
  return el
    .querySelector(`meta[property="og:${og}"]`)
    ?.getAttribute('content')!;
}

export function createParams(
  params: string | string[][] | Record<string, string>,
): string {
  return new URLSearchParams(params).toString();
}

export async function quickSearch(query: string): Promise<QuickMovie[]> {
  try {
    const res = await axios.post('https://rezka.ag/engine/ajax/search.php', {
      q: query,
    });
    const dom = parse(res.data);
    const items: QuickMovie[] = [];
    dom.querySelectorAll('a').forEach(x => {
      if (x.classList.length > 0) return;
      items.push({
        url: x.getAttribute('href')!,
        name: x.textContent!,
        enabled: true,
        id: 'QuickSearch ID',
      });
    });
    console.log('qS', items.length);
    if (items.length) return items;
    else return [{enabled: false, name: 'Not found anything', url: '', id: ''}];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function search(
  query: string,
  page: number,
): Promise<PreviewMovie[]> {
  try {
    console.log('query: %s p: ', query, page);
    const res = await axios.get(
      `https://rezka.ag/search/?do=search&subaction=search&q=${query}&page=${page}`,
    );
    const dom = parse(res.data);
    const htmlFilms = dom.querySelectorAll('.b-content__inline_item');
    console.log('res: %d', htmlFilms.length);
    if (htmlFilms.length === 0) return [];
    const films: PreviewMovie[] = [];
    htmlFilms.forEach(x => {
      const cover = x.querySelector('div.b-content__inline_item-cover');
      const link = cover?.querySelector('a')?.getAttribute('href');
      const img = cover?.querySelector('a > img');
      const imgUrl = img?.getAttribute('src');
      const name = img?.getAttribute('alt');
      const type = cover?.querySelector('span')?.classList.value[1];
      films.push({
        enabled: true,
        id: x.getAttribute('data-id')!,
        name: name!,
        thumbnail: imgUrl!,
        type: type as MovieType,
        url: link!,
      });
    });
    return films;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getHtmlFromURL(url: string): Promise<string> {
  const res = await axios.get(url);
  return valid(res.data) ? res.data : '';
}

export async function getTranslationSeries(
  id: string,
  translation: Instance,
): Promise<Season[]> {
  const reqArgs = {
    id,
    translator_id: translation.id,
    action: 'get_episodes',
    is_ads:0,
    is_camrip:0,
    is_director:0,
    favs: '505e5395-2a2b-44a3-b924-4db807aa1c99'
  };
  try {
    const res = await axios.post(
      'https://rezka.ag/ajax/get_cdn_series/',
      reqArgs,
    );
    if (!res.data.success)
      throw new Error(
        `Could not retrieve seasons, episodes for specified translation: ${res.data.message}`,
      );
    const seasonsDOM = parse(res.data.seasons);
    const seasonNodes = seasonsDOM.querySelectorAll('li');
    const seasons: any[] = [];
    seasonNodes.forEach(x =>
      seasons.push({
        id: x.getAttribute('data-tab_id'),
        name: x.textContent,
      }),
    );

    const episodesDOM = parse(res.data.episodes);
    const episodeNodes = episodesDOM.querySelectorAll('li');
    const episodes: any[] = [];
    episodeNodes.forEach(x =>
      episodes.push({
        id: x.getAttribute('data-episode_id'),
        season: x.getAttribute('data-season_id'),
        movie: x.getAttribute('data-id'),
        name: x.textContent,
        quality: (x.getAttribute('data-cdn_quality') == 'null'
          ? 'none'
          : x.getAttribute('data-cdn_quality')) as VideoQuality,
        cdn:
          x.getAttribute('data-cdn_url') == 'null'
            ? 'none'
            : x.getAttribute('data-cdn_url'),
      }),
    );
    const returnList: Season[] = [];
    for (const season of seasons) {
      const seasonEpisodes = episodes.filter(x => x.season === season.id);
      returnList.push({
        id: season.id!,
        name: season.name,
        episodes: seasonEpisodes.map(x => ({
          id: x.id!,
          name: x.name!,
          cdnUrl: x.cdn!,
          quality: x.quality! as VideoQuality,
        })),
        translation: translation,
      });
    }
    return returnList;
  } catch (err) {
    console.error(err);
    return [];
  }
}
export function parseCdnUrl(cdn: string): VideoProps[] {
  const decodedUrls = clearTrash(cdn);
  const decodedArr = decodedUrls.split(',');
  const finArr: VideoProps[] = [];
  for (const url of decodedArr) {
    const r = /\[(.*)\](.*):hls:/.exec(decodedUrls);
    if (r?.[0] == null) continue;
    finArr.push({quality: r[1] as VideoQuality,url: r![2]});
  }
  return finArr;
}
function clearTrash(data: string): string {
  const trashList: string[] = ['@', '#', '!', '^', '$'];
  const trashCodesSet: string[] = [];

  for (let i = 2; i < 4; i++) {
    for (const chars of generateCombinations(trashList, i)) {
      const trashCombo = Buffer.from(chars.join('')).toString('base64');
      trashCodesSet.push(trashCombo);
    }
  }

  const arr = data.replace('#h', '').split('//_//');
  let trashString = arr.join('');

  for (const code of trashCodesSet) {
    const temp = Buffer.from(code, 'base64').toString('utf-8');
    trashString = trashString.replace(temp, '');
  }

  const finalString = Buffer.from(trashString + '==', 'base64').toString(
    'utf-8',
  );
  return finalString;
}

function generateCombinations<T>(elements: T[], length: number): T[][] {
  if (length === 1) return elements.map(element => [element]);

  const result: T[][] = [];
  const rest = generateCombinations(elements, length - 1);
  for (const element of elements) {
    for (const combination of rest) {
      result.push([element, ...combination]);
    }
  }

  return result;
}
