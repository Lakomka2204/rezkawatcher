import axios from 'axios';
import {check, init} from './init';
import * as mv from './movie';
init();
describe("axios initialization", () => {
    it('should initialize',() => {
        init();
        expect(check()).toBeTruthy();
    });
});
describe('static search functions',() => {
    it('should have the specific name in returned array', async () => {
        const movies = await mv.quickSearch('film');
        expect(movies.length).toBeGreaterThan(0);
        expect(movies[0].name).toContain('Киноработник');
        expect(movies[0].url).toContain('films/documentary/50483-kinorabotnik-2017.html');
    });
    it('should return empty array',async () => {
        const movies = await mv.quickSearch('');
        expect(movies.length).toEqual(1);
        expect(movies[0].enabled).toBeFalsy();
    });
    it('should have correct properties',async () => {
        const movies = await mv.search('film',1);
        expect(movies.length).toEqual(36);
        const currentMovie = movies[0];
        expect(currentMovie.id).toBe('50483');
        const thumbnail = await axios.get(currentMovie.thumbnail);
        expect(thumbnail.status).toBe(200);
        expect(currentMovie.name).toContain("Киноработник");
        expect<mv.MovieType>(currentMovie.type).toBe<mv.MovieType>('films');
    });
    it('should return non-empty string', async () => {
        const html = await mv.getHtmlFromURL('https://rezka.ag/films/documentary/50483-kinorabotnik-2017.html');
        expect(html).toBeTruthy();
        const failHtml = await mv.getHtmlFromURL('http://google.com/generate_204');
        expect(failHtml).toBeFalsy();
    });
});
describe('movie class methods',() => {
    it('should properly initialize all properties',async () => {
        const html = await mv.getHtmlFromURL('https://rezka.ag/films/documentary/50483-kinorabotnik-2017.html');
        const movie = new mv.Movie(html);
        expect(movie.description).toContain(' выдающийся кинорежиссер Стенли Кубрик выпускает на большие экраны');
        expect(movie.name).toEqual('Киноработник (2017)');
        expect(movie.originalName).toEqual('Filmworker');
        // expect(movie.ratings.length).toStrictEqual(1); // removed initializing ratings
        // expect(movie.ratings[0].name).toEqual('IMDb');
        // expect(movie.ratings[0].score).not.toBeNaN();
        expect(movie.thumbnail).toContain('https://static');
        const translators = movie.translators;
        expect(translators.length).toEqual(1);
        expect(translators[0].id).toEqual('356');
        expect(translators[0].name).toEqual("Любительский");
        expect(movie.id).toEqual('50483');
    });
    it('should properly get multiple translations', async () => {
        const html = await mv.getHtmlFromURL('https://rezka.ag/animation/fantasy/51376-chelovek-benzopila-2022.html');
        const movie = new mv.Movie(html);
        const translations = movie.translators;
        expect(translations.length).toEqual(18);
        expect(translations[0].id).toEqual('56');
        expect(translations[2].name).toContain('SHIZA');
    });
    it("should get seasons & episodes from translator id", async () => {
        const html = await mv.getHtmlFromURL('https://rezka.ag/animation/adventures/12113-van-pis-1999.html');
        const movie = new mv.Movie(html);
        const translation = movie.translators[6];
        const seasons = await mv.getTranslationSeries(movie.id,translation);
        expect(seasons.length).toEqual(22);
        expect(seasons[0].episodes[0].cdnUrl).toBeTruthy();
        expect(seasons[0].episodes[0].quality).toBe<mv.VideoQuality>('none');
        const season = seasons[10];
        expect(season.translation.id).toEqual('234');
        expect(season.translation.name).toContain('Persona');
        expect(season.id).toEqual('11');
        expect(season.name).toMatch(/Сезон \d*/)
        expect(season.episodes.length).toEqual(26);
        expect(season.episodes[25].name).toMatch(/Серия \d*/);
        expect(season.episodes[25].id).toEqual('407');
        const firstTranslation = await mv.getTranslationSeries(movie.id,movie.translators[0]);
        const videos = mv.parseCdnUrl(firstTranslation[0].episodes[0].cdnUrl);
        expect(videos.length).toBeGreaterThan(1);
        expect(videos[0].quality).not.toBe<mv.VideoQuality>('none');
        const res = await axios.head(videos[0].url);
        expect(res.status).toBe(200);
    });
});