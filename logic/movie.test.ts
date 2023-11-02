import axios from 'axios';
import {check, init} from './init';
import * as mv from './movie';
init();
describe('url parsing', () => {
    it('should return some kind of url',() => {
        const str = mv.clearTrash('#hWzM2MHBdaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjLzZjZjBmYTc4MDlhODAyYTEwNzhlOWEyOTI5ZWI2MGFmOjIwMjMxMTAxMTU6T1ZaYU9IZFZjUzlTYUdSRVNIbzFkamxGYUZsTFQxcFhLMlE0TkVkb1JVZzVSMWxoYjNaaVEwZHdhM2syVkZodlFVWTNVazlMZEVSTE5GVXlXblphUkZWR2JFZFlibmt5TTJoclJHNUNWVnB6YldSNlRsRTlQUT09LzgvNS80LzAvNi85L2I4dW1oLm1wNDpobHM6bWFuaWZlc3QubTN1OCBvciBodHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvNmNmMGZhNzgwOWE4MDJhMTA3OGU5YTI5MjllYjYwYWY6MjAyMzExMDExNTpPVlphT0hkVmNTOVNhR1JFU0hvMWRqbEZhRmxMVDFwWEsyUTRORWRvUlVnNVIxbGhiM1ppUTBkd2EzazJWRmh2UVVZM1VrOUxkRVJMTkZVeVduWmFSRlZHYkVkWWJua3lNMmhyUkc1Q1ZWcHpiV1I2VGxFOVBRPT0vOC81LzQvMC82LzkvYjh1bWgubXA0LFs0ODBwXWh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy8yOTk5NGQ5NmIxMDU3ODVhMDUxM2NkYzVlMzY0NGU0YToyMDIzMTEwMTE1Ok9WWmFPSGRWY1M5U2FHUkVTSG8xZGpsRmFGbExUMXBYSzJRNE5FZG9SVWc1UjFsaGIzWmlRMGR3YTNrMlZGaHZRVVkzVWs5TGRFUkxORlV5V25aYVJGVkdiR//_//JCQjISFAIyFAIyM=WRZYm5reU0yaHJSRzVDVlZwemJXUjZUbEU5UFE9PS84LzUvNC8wLzYvOS9kbWh2MS5tcDQ6aGxzOm1hbmlmZXN0//_//IyMjI14hISMjIUBALm0zdTggb3IgaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjLzI5OTk0ZDk2YjEwNTc4NWEwNTEzY2RjNWUzNjQ0ZTRhOjIwMjMxMTAxMTU6T1ZaYU9IZFZjUzlTYUdSRVNIbzFkamxGYUZsTFQxcFhLMlE0TkVkb1JVZzVSMWxoYjNaaVEwZHdhM2syVkZodlFVWTNVazlMZEVSTE5GVXlXblphUkZWR2JFZFlibmt5TTJoclJHNUNWVnB6YldSNlRsRTlQUT09LzgvNS80LzAvNi85L2Rta//_//Xl5eIUAjIyEhIyM=HYxLm1wNCxbNzIwcF1odHRwczovL3N0cmVhbS52b//_//JCQhIUAkJEBeIUAjJCRA2lkYm9vc3QuY2MvYTY0YjYzYjIxNWEyZTk3ODZlMTNkMTJmZTM2MzA3ZDY6MjAyMzExMDExNTpPVlphT0hkVmNTOVNhR1JFU0hvMWRqbEZhRmxMVDFwWEsyUTRORWRvUlVnNVIxbGhiM1ppUTBkd2EzazJWRmh2UVVZM1VrOUxkRVJMTkZVeVduWmFSRlZHYkVkWWJua3lNMmhyUkc1Q1ZWcHpiV1I2VGxFOVBRPT0vOC81LzQvMC82LzkvMmdodHcubXA0OmhsczptYW5pZmVzdC5tM3U4IG9yIGh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy9hNjRiNjNiMjE1YTJlOTc4NmUxM2QxMmZlMzYzMDdkNjoyMDIzMTEwMTE1Ok9WWmFPSGRWY1M5U2FHUkVTSG8xZGpsRmFGbExUMXBYSzJRNE5FZG9SVWc1UjFsaGIzWmlRMGR3YTNrMlZGaHZRVVkzVWs5TGRFUkxORlV5V25aYVJGVkdiRWRZYm5reU0yaHJSRzVDVlZwemJXUjZUbEU5UFE9PS84LzUvNC8wLzYvOS8yZ2h0dy5tcDQsWzEwODBwXWh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy9mZjQyNTM4MDI0MDQ3YWJhYzE5NjkzZTRhNTk5YzQwODoyMDIzMTEwMTE1Ok9WWmFPSGRWY1M5U2FHUkVTSG8xZGpsRmFGbExUMXBYSzJRNE5FZG9SVWc1UjFsaGIzWmlRMGR3YTNrMlZGaHZRVVkzVWs5TGRFUkxORlV5V25aYVJGVkdiRWRZYm5reU0yaHJSRzVDVlZwemJXUjZUbEU5UFE9PS84LzUvNC8wLzYvOS9ycWVwcy5tcDQ6aGxzOm1hbmlmZXN0Lm0zdTggb3IgaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjL2Zm//_//QEBAQEAhIyMhXl5eNDI1MzgwMjQwNDdhYmFjMTk2OTNlNGE1OTljNDA4OjIwMjMxMTAxMTU6T1ZaYU9IZFZjUzlTYUdSRVNIbzFkamxGYUZsTFQxcFhLMlE0TkVkb1JVZzVSMWxoYjNaaVEwZHdhM2syVkZodlFVWTNVazlMZEVSTE5GVXlXblphUkZWR2JFZFlibmt5TTJoclJHNUNWVnB6YldSNlRsRTlQUT09LzgvNS80LzAvNi85L3JxZXBzLm1wNCxbMTA4MHAgVWx0cmFdaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjL2ZmNDI1MzgwMjQwNDdhYmFjMTk2OTNlNGE1OTljNDA4OjIwMjMxMTAxMTU6T1ZaYU9IZFZjUzlTYUdSRVNIbzFkamxGYUZsTFQxcFhLMlE0TkVkb1JVZzVSMWxoYjNaaVEwZHdhM2syVkZodlFVWTNVazlMZEVSTE5GVXlXblphUkZWR2JFZFlibmt5TTJoclJHNUNWVnB6YldSNlRsRTlQUT09LzgvNS80LzAvNi85L3JxZXBzLm1wNDpobHM6bWFuaWZlc3QubTN1OCBvciBodHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvZmY0MjUzODAyNDA0N2FiYWMxOTY5M2U0YTU5OWM0MDg6MjAyMzExMDExNTpPVlphT0hkVmNTOVNhR1JFU0hvMWRqbEZhRmxMVDFwWEsyUTRORWRvUlVnNVIxbGhiM1ppUTBkd2EzazJWRmh2UVVZM1VrOUxkRVJMTkZVeVduWmFSRlZHYkVkWWJua3lNMmhyUkc1Q1ZWcHpiV1I2VGxFOVBRPT0vOC81LzQvMC82LzkvcnFlcHMubXA0');
        const r = /\[(.*)\](?:.*)or (.*)/gm.exec(str);
        expect(r?.[0]).not.toBeNull();
        
    });
});
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
        const translators = movie.getTranslations();
        expect(translators.length).toEqual(1);
        expect(translators[0].id).toEqual('356');
        expect(translators[0].name).toEqual("Любительский");
        expect(movie.id).toEqual('50483');
    });
    it('should properly get multiple translations', async () => {
        const html = await mv.getHtmlFromURL('https://rezka.ag/animation/fantasy/51376-chelovek-benzopila-2022.html');
        const movie = new mv.Movie(html);
        const translations = movie.getTranslations();
        expect(translations.length).toEqual(18);
        expect(translations[0].id).toEqual('56');
        expect(translations[2].name).toContain('SHIZA');
    });
    it("should get seasons & episodes from translator id", async () => {
        const html = await mv.getHtmlFromURL('https://rezka.ag/animation/adventures/12113-van-pis-1999.html');
        const movie = new mv.Movie(html);
        const translation = movie.getTranslations()[6];
        const seasons = await movie.getTranslationSeries(translation);
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
    });
});