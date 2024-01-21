import axios from 'axios';
import {check, init} from './init';
import * as mv from './movie';
init();
describe('axios initialization', () => {
  it('should initialize', () => {
    init();
    expect(check()).toBeTruthy();
  });
});
describe('static search functions', () => {
  it('should have the specific name in returned array', async () => {
    const movies = await mv.quickSearch('film');
    expect(movies.length).toBeGreaterThan(0);
    expect(movies[0].name).toContain('Киноработник');
    expect(movies[0].url).toContain(
      'films/documentary/50483-kinorabotnik-2017.html',
    );
  });
  it('should return empty array', async () => {
    const movies = await mv.quickSearch('');
    expect(movies.length).toEqual(0);
  });
  it('should have correct properties', async () => {
    const movies = await mv.search('film', 1);
    expect(movies.length).toEqual(36);
    const currentMovie = movies[0];
    expect(currentMovie.id).toBe('50483');
    const thumbnail = await axios.get(currentMovie.thumbnail);
    expect(thumbnail.status).toBe(200);
    expect(currentMovie.name).toContain('Киноработник');
    expect<mv.MovieType>(currentMovie.type).toBe<mv.MovieType>('films');
  });
  it('should return non-empty string', async () => {
    const html = await mv.getHtmlFromURL(
      'https://rezka.ag/films/documentary/50483-kinorabotnik-2017.html',
    );
    expect(html).toBeTruthy();
    const failHtml = await mv.getHtmlFromURL('http://google.com/generate_204');
    expect(failHtml).toBeFalsy();
  });
});

describe('movie class methods', () => {
  it('should properly initialize all properties', async () => {
    const html = await mv.getHtmlFromURL(
      'https://rezka.ag/films/documentary/50483-kinorabotnik-2017.html',
    );
    const movie = new mv.Movie(html);
    expect(movie.description).toContain(
      ' выдающийся кинорежиссер Стенли Кубрик выпускает на большие экраны',
    );
    expect(movie.name).toEqual('Киноработник (2017)');
    expect(movie.originalName).toEqual('Filmworker');
    expect(movie.thumbnail).toContain('https://static');
    const translators = movie.translators;
    expect(translators.length).toEqual(1);
    expect(translators[0].id).toEqual('356');
    expect(translators[0].name).toEqual('Любительский');
    expect(movie.id).toEqual('50483');
  });
  it('should properly get multiple translations', async () => {
    const html = await mv.getHtmlFromURL(
      'https://rezka.ag/animation/fantasy/51376-chelovek-benzopila-2022.html',
    );
    const movie = new mv.Movie(html);
    const translations = movie.translators;
    expect(translations.length).toEqual(18);
    expect(translations[0].id).toEqual('56');
    expect(translations[2].name).toContain('SHIZA');
  });
  it('should correctly convert cdn to list of cdn urls', () => {
    const encoded =
      '#hWzM2MHBdaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjL2M5NjkyNGUwNWZiODQ0NjljNDZjZGNhMTkzODgzYTA4OjIwMjMxMTA2MTE6T1ZaYU9IZFZjUzlTYUdSRVNIbzFkamxGYUZsTFQxcFhLMlE0TkVkb1JVZzVSMWxoYjNaaVEwZHdhM2syVkZodlFVWTNVazlMZEVSTE5GVXlXblphUkRWMVdtMXBaRk52YjJWQlNrSXlVRTR2WmtwbFZYYzlQUT09LzcvMC80LzAvNS84L3A4bnl3Lm1wNDpobHM6bWFuaWZlc3QubTN1OCBvciBodHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvYzk2OTI0ZTA1ZmI4NDQ2OWM0NmNkY2ExOTM4ODNhMDg6MjAyMzExMDYxMTpPVlphT0hkVmNTOVNhR1JFU0hvMWRqbEZhRmxMVDFwWEsyUTRORWRvUlVnNVIxbGhiM1ppUTBkd2EzazJWRmh2UVVZM1VrOUxkRVJMTkZVeVduWmFSRFYxV20xcFpGTnZiMlZCU2tJeVVFNHZaa3BsVlhjOVBRPT0vNy8wLzQvMC81LzgvcDhueXcubXA0LFs0ODBwXWh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy8yOTc4Zjk0NGMyYTZlMDQ4NTMyN2QwZjA1YjM3YmVjMDoyMDIzMTEwNjExOk9WWmFPSGRWY1M5U2FHUkVTSG8xZGpsRmFGbExUMXBYSzJRNE5FZG9SVWc1UjFsaGIzWmlRMGR3YTNrMlZGaHZRVVkzVWs5TGRFUkxORlV5V25aYVJEVjFXbTFwWkZOdmIyVkJTa0l5VUU0dlprcGxWWGM5UFE9PS83LzAvNC8wLzUvOC94b2RoeS5tcDQ6aGxzOm1hbmlmZXN0Lm0zdTggb3IgaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjLzI5NzhmOTQ0YzJhNmUwNDg1MzI3ZDBmMDViMzdiZWMwOjIwMjMxMTA2MTE6T1ZaYU9IZFZjUzlTYUdSRVNIbzFkamxGYUZsTFQxcFhLMlE0TkVkb1JVZzVSMWxoYjNaaVEwZHdhM2syVkZodlFVWTNVazlMZEVSTE5GVXlXblphUkRWMVdtMXBaRk52YjJWQlNrSXlVRTR2WmtwbFZYYzlQUT09LzcvMC80LzAvNS84L3hvZGh5Lm1wNCxbNzIwcF1odHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvOTlhMjkyN2RkZTgyNzVkODNiYjllNGM2MGQ0OGY2NDk6MjAyMzExMDYxMTpPVlphT0hkVmNTOVNhR1JFU0hvMWRqbEZhRmxMVDFwWEsyUTRORWRvUlVnNVIxbGhiM1ppUTBkd2EzazJWRmh2UVVZM1VrOUxkRVJMTkZVeVduWmFSRFYxV20xcFpGTnZiMlZCU2tJeVVFNHZaa3BsVlhjOVBRPT0vNy8wLzQvMC81LzgvY3huN2YubXA0OmhsczptYW5pZmVzdC5tM3U4IG9yIGh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy85OWEyOTI3ZGRlODI3NWQ4M2JiOWU0YzYwZDQ4ZjY0OToyMDIzMTEwNjExOk9WWmFPSGRWY1M5U2FHUkVTSG8xZGpsRmFGbExUMXBYSzJRNE5FZG9SVWc1UjFsaGIzWmlRMGR3YTNrMl//_//JCQjISFAIyFAIyM=ZGaHZRVVkzVWs5TGRFUkxORlV5V25aYVJEVjFXbTFwWkZOdmIyVkJTa0l5VUU0dlprcG//_//JCQhIUAkJEBeIUAjJCRAxWWGM5UFE9PS83LzAvNC8wLzUvOC9jeG43Zi5tcDQsWzEw//_//Xl5eIUAjIyEhIyM=ODBwXWh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy8xNDY0ZTE4MWM0MDg2ODlhOTRiMGE2NmI2Y2I0NTA2NjoyMDIzMTEwNjExOk9WWmFPSGRWY1M5U2FHUkVTSG8xZGpsRmFGbExUMXBYSzJRNE5FZG9SVWc1UjFsaGIzWmlRMGR3YTNrMlZ//_//QEBAQEAhIyMhXl5eGaHZRVVkzVWs5TGRFUkxORlV5V25aYVJEVjFXbTFwWkZOdmIyVkJTa0l5VUU0dlprcGxWWGM5UFE9PS83LzAvNC8wLzUvOC9wMGF6di5tcDQ6aGxzOm1hbmlmZXN0Lm0zdTggb3IgaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjLzE0NjRlMTgxYzQwODY4OWE5NGIwYTY2YjZjYjQ1MDY2OjIwMjMxMTA2MTE6T1ZaYU9IZFZjUzlTYUdSRVNIbzFkamxGYUZsTFQxcFhLMlE0TkVkb1JVZzVSMWxoYjNaaVEwZHdhM2syVkZodlFVWTNVazlMZEVSTE5GVXlXblphUkRWMVdtMXBaRk52YjJWQlNrSXlVRTR2WmtwbFZYYzlQUT09LzcvMC80LzAvNS84L3AwYX//_//IyMjI14hISMjIUBAp2Lm1wNCxbMTA4MHAgVWx0cmFdaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjLzE0NjRlMTgxYzQwODY4OWE5NGIwYTY2YjZjYjQ1MDY2OjIwMjMxMTA2MTE6T1ZaYU9IZFZjUzlTYUdSRVNIbzFkamxGYUZsTFQxcFhLMlE0TkVkb1JVZzVSMWxoYjNaaVEwZHdhM2syVkZodlFVWTNVazlMZEVSTE5GVXlXblphUkRWMVdtMXBaRk52YjJWQlNrSXlVRTR2WmtwbFZYYzlQUT09LzcvMC80LzAvNS84L3AwYXp2Lm1wNDpobHM6bWFuaWZlc3QubTN1OCBvciBodHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvMTQ2NGUxODFjNDA4Njg5YTk0YjBhNjZiNmNiNDUwNjY6MjAyMzExMDYxMTpPVlphT0hkVmNTOVNhR1JFU0hvMWRqbEZhRmxMVDFwWEsyUTRORWRvUlVnNVIxbGhiM1ppUTBkd2EzazJWRmh2UVVZM1VrOUxkRVJMTkZVeVduWmFSRFYxV20xcFpGTnZiMlZCU2tJeVVFNHZaa3BsVlhjOVBRPT0vNy8wLzQvMC81LzgvcDBhenYubXA0';
    const str = mv.clearTrash(encoded);
    expect(/^[\x00-\x7F]*$/.test(str)).toBeTruthy();
    const qurls = str.split(',');
    expect(qurls.length).toBeGreaterThan(4);
    const regex = /\[(.*)\](.*):hls:(?:.*)or (.*)/;
    for (let url of qurls) {
      const res = regex.exec(url);
      expect(res?.[0]).toBeTruthy();
      expect(res![1]).toContain('p');
      expect(res![2]).toBeTruthy();
      expect(res![3]).toBeTruthy();
    }
  });
  it('should retrieve subtitles', async () => {
    const html = await mv.getHtmlFromURL(
      'https://rezka.ag/cartoons/fantasy/63772-supermonstry-i-ih-pitomcy-2019.html',
    );
    const movie = new mv.Movie(html);
    const videoInfo = await mv.getStream(
      movie.id,
      '1',
      '3',
      movie.translators[1].id,
    );
    expect(videoInfo.videos.length).toBeGreaterThanOrEqual(1);
    expect(videoInfo.subtitles.length).toEqual(2);
    expect(videoInfo.defaultSubtitle).not.toBeNull();
    expect(await mv.testRemoteFile(videoInfo.subtitles[0].url)).toBeTruthy();
  });

  it('should correctly parse cdn urls', async () => {
    const html = await mv.getHtmlFromURL(
      'https://rezka.ag/animation/fantasy/51376-chelovek-benzopila-2022.html',
    );
    const movie = new mv.Movie(html);
    expect(movie.translators.length).toEqual(18);
    const belTranslation = movie.translators[16];
    const stream = await mv.getStream(movie.id, '1', '4', belTranslation.id);
    expect(stream.videos.length).toBeGreaterThan(4);
    expect(stream.videos[0].quality).toEqual('360p');
    expect(await mv.testRemoteFile(stream.videos[0].streamUrl)).toBeTruthy();
  });
  it('should get seasons & episodes from translator id', async () => {
    const html = await mv.getHtmlFromURL(
      'https://rezka.ag/animation/adventures/12113-van-pis-1999.html',
    );
    const movie = new mv.Movie(html);
    const translation = movie.translators[6];
    const seasons = await mv.getTranslationSeries(
      movie.id,
      translation,
      movie.favs,
    );
    expect(seasons.length).toEqual(22);
    expect(seasons[0].episodes[0].cdnUrl).toBeTruthy();
    expect(seasons[0].episodes[0].quality).toBe<mv.VideoQuality>('none');
    const season = seasons[10];
    expect(season.translation.id).toEqual('234');
    expect(season.translation.name).toContain('Persona');
    expect(season.id).toEqual('11');
    expect(season.name).toMatch(/Сезон \d*/);
    expect(season.episodes.length).toEqual(26);
    expect(season.episodes[25].name).toMatch(/Серия \d*/);
    expect(season.episodes[25].id).toEqual('407');
    const firstTranslation = await mv.getTranslationSeries(
      movie.id,
      movie.translators[0],
      movie.favs,
    );
    const videos = mv.parseCdnUrl(firstTranslation[0].episodes[0].cdnUrl);
    expect(videos.length).toBeGreaterThan(4);
    expect(videos[0].quality).not.toBe<mv.VideoQuality>('none');
    const res = await axios.head(videos[0].streamUrl);
    expect(res.status).toBe(200);
  });
  it('should make correct cartesian array', () => {
    expect(mv.generateCombinations(['@', '#', '!', '^', '$'], 2).length).toBe(
      25,
    );
    expect(mv.generateCombinations(['@', '#', '!', '^', '$'], 3).length).toBe(
      125,
    );
  });
});
