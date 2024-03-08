import axios from 'axios';
import { init} from './init';
import {Movie, MovieType} from './movie';
import { log} from 'console';
init();
const host = 'rezka.ag';
describe('axios initialization', () => {
  it('should initialize', () => {
    init();
    expect(axios.defaults.withCredentials).toBeTruthy();
    expect((axios.defaults.headers.common['User-Agent'] as string).length).toBeGreaterThanOrEqual(115)
  });
});
describe('static search functions', () => {
  it('should have the specific name in returned array', async () => {
    const movies = await Movie.quickSearch(host,'film');
    expect(movies.length).toBeGreaterThan(0);
    expect(movies[0].name).toContain('Киноработник');
    expect(movies[0].url).toContain(
      'films/documentary/50483-kinorabotnik-2017.html',
    );
  });
  it('should return empty array', async () => {
    const movies = await Movie.quickSearch(host,'');
    expect(movies.length).toEqual(0);
  });
  it('should have correct properties', async () => {
    const movies = await Movie.search(host,'film', 1);
    expect(movies.length).toEqual(36);
    const currentMovie = movies[0];
    expect(currentMovie.id).toBe('50483');
    const thumbnail = await axios.get(currentMovie.thumbnail);
    expect(thumbnail.status).toBe(200);
    expect(currentMovie.name).toContain('Киноработник');
    expect<MovieType>(currentMovie.type).toBe<MovieType>('films');
  });
});

describe('movie class methods', () => {
  it('should properly initialize all properties', async () => {
    const movie = await Movie.get('https://rezka.ag/films/documentary/50483-kinorabotnik-2017.html')
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
    const movie = await Movie.get('https://rezka.ag/animation/fantasy/51376-chelovek-benzopila-2022.html')
    const translations = movie.translators;
    expect(translations.length).toEqual(18);
    expect(translations[0].id).toEqual('56');
    expect(translations[2].name).toContain('SHIZA');
  });
  it('should get seasons & episodes from translator id', async () => {
    const movie = await Movie.get('https://rezka.ag/animation/adventures/12113-van-pis-1999.html');
    const translation = movie.translators[1];
    expect(await movie.getTranslationSeries(translation.id)).toBeTruthy();
    expect(translation?.seasons?.length).toEqual(21);
    const season = translation!.seasons![10];
    expect(season.translation.id).toEqual('234');
    expect(season.translation.name).toContain('Persona');
    expect(season.id).toEqual('11');
    expect(season.name).toMatch(/Сезон \d*/);
    expect(season.episodes.length).toEqual(26);
    expect(season.episodes[25].name).toMatch(/Серия \d*/);
    expect(season.episodes[25].id).toEqual('407');
  });
  it('should correctly parse cdn urls and check availability',async () => {
    const movie = await Movie.get('https://rezka.ag/animation/fantasy/51376-chelovek-benzopila-2022.html')
    const translations = movie.translators;
    expect(translations.length).toEqual(18);
    expect(translations[0].id).toEqual('56');
    expect(translations[2].name).toContain('SHIZA');
    const props = await movie.getEpisodeStreams('1','1',translations[0].id);
    expect(props.length).toBe(5);
    const cdns = props[0];
    expect(cdns.voidboostCdn).toContain('https://');
    expect(await axios.head(cdns.voidboostCdn)).toThrow();
    const res = await axios.head(cdns.ukrtelCdn);
    expect(res.status).toBe(200);
  },30000);
  it('should correctly parse cdn urls AND return ukrtel cdn url v2',() => {
    const cdnEncoded = '#hWzM2MHBdaHR0cHM6Ly9wcngyLWFtcy51a3J0ZWxjZG4ubmV0L2UzYWI5NTYzMzAyNDFjYmEyNmEwYTg0MWI3OWNlNTQxOjIwMjQwMzA5MTk6WlhkbGRqVnRja3MwT0ZOdU1rUlpTa05DTVRKNVUzaHJkSGxaYVZWWlJ6QXJZWFVyWW1WVWNIWnpNR3gyV1U1alMweFNRMm//_//IyMjI14hISMjIUBAREUmtRM1NUaDRaWGR0ZFhsR2VIQTBSbEIwUjFOVlJFTk5RbVpMYkhaWmExRTlQUT09LzYvOS8yLzMvMC8yL293djFrLm1wNCBvciBodHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvZTNhYjk1NjMzMDI0MWNiYTI2YTBhODQxYjc5Y2U1NDE6MjAyNDAzMDkxOTpaWGRsZGpWdGNrczBPRk51TWtSWlNrTkNNVEo1VTNocmRIbFphVlZaUnpBcllYVXJZbVZVY0haek1HeDJXVTVqUzB4U1EyZERSa1EzU1RoNFpYZHRkWGxHZUhBMFJsQjBSMU5WUkVOTlFtWkxiSFpaYTFFOVBRPT0vNi85LzIvMy8wLzIvb3d2MWsubXA0LFs0ODBwXWh0dHBzOi8vcHJ4Mi1hbXMudWtydGVsY2RuLm5ldC82NDU1OWExZWRmZjg2NjViNTVlZDY5Y2I0YzVmNzQwNDoyMDI0MDMwOTE5OlpYZGxkalZ0Y2tzME9GTnVNa1JaU2tOQ01USjVVM2hyZEhsWmFWVlpSekFyWVhVclltVlVjSFp6TUd4MldVNWpTMHhTUTJkRFJrUTNTVGg0WlhkdGRYbEdlSEEwUmxCMFIxTlZSRU5OUW1aTGJIWlphMUU5UFE9PS82LzkvMi8zLzAvMi93a2t4ZS5tcDQgb3IgaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjLzY0NTU5YTFlZGZmODY2NWI1NWVkNjljYjRjNWY3NDA0OjIwMjQwMzA5MTk6WlhkbGRqVnRja3MwT0ZOdU1rUlpTa05DTVRKNVUzaHJkSGxaYVZWWlJ6QXJZWFVyWW1WVWNIWnpNR3gyV1U1alMweFNRMmREUmtRM1NUaDRaWGR0ZFhsR2VIQTBSbEIwUjFOVlJFTk5RbVpMYkhaWmExRTlQUT09LzYvOS8yLzMvMC8yL3dra3hlLm1wNCxbNzIwcF1odHRwczovL3ByeDItYW1zLnVrcnRlbGNkbi5uZXQvNDE3ZDBlNWU//_//Xl5eIUAjIyEhIyM=2YTMyZDg2YThlY2Y5YTBhMDUxNDMwYjA6MjAyNDAzMDkxOTpaWGRsZGpWdGNrczBPRk51TWtSWlNrTkNNVEo1VTNocmRIbFphVlZaUnpBcllYVXJZbVZVY0haek1HeDJXVTVqUzB4U1EyZERSa1EzU1RoNFpYZHRkWGxHZUhBMFJsQjBSMU5WUkVOTlFtWkxiSFpaYTFFOVBRPT0vNi85LzIvMy8wLzIvNTdoZnkubXA0IG9yIGh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy80MTdkMGU1ZTZhMzJkODZhOGVjZjlhMGEwNTE0MzBiMDoyMDI0MDMwOTE5OlpYZGxkalZ0Y2tzME9GTnVNa1JaU2tOQ01USjVVM2hyZEhsWmFWVlpSekFyWVhVclltVlVjSFp6TUd4MldVNWpTMHhTUTJkRFJrUTNTVGg0WlhkdGRYbEdlSEEwUmxCMFIxTlZSRU5OUW1aTGJIWlphMUU5UFE9PS82LzkvMi8zLzAvMi81N2hmeS5tcDQsWzEwODBwXWh0dHBzOi8vcHJ4Mi1hbXMudWtydGVsY2RuLm5ldC80YTUzMjE1ZDUyNjNkMjI4OTAxYzA2N2QwY2JhZjlhYToyMDI0MDMwOTE5OlpYZGxkalZ0Y2tzME9GTnVNa1JaU2tOQ01USjVVM2hyZEhsWmFWVlpSekFyWVhVclltVlVjSFp6TUd4MldVNWpTMHhTUTJkRFJrUTNTVGg0WlhkdGRYbEdlSEEwUmxCMFIxTlZSRU5OUW1aTGJIWlphMUU5UFE9PS82LzkvMi8zLzAvMi9iYnN1Ny5tcDQgb3IgaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjLzRhNTMyMTVkNTI2M2QyMjg5MDFjMDY3ZDBjYmFmOWFhOjIwMjQwMzA5MTk6WlhkbGRqVnRja3MwT0ZOdU1rUlpTa05DTVRKNVUzaHJkSGxaYVZWWlJ6QXJZWFVyWW1WVWNIWnpNR3gyV1U1alMweFNRMmREUmtRM1NUaDRaWGR0ZFhsR2VIQTBSbEIwUjFOVlJFTk5RbVpMYkhaWmExRTlQUT09LzYvOS8yLzMvMC8yL2Jic3U3Lm1wNCxbMTA4MHAgVWx0cmFdaHR0cHM6Ly9wcngyLWFtcy51a3J0ZWxjZG4ubmV0LzRhNTMyMTVkNTI2M2QyMjg5MDFjMDY3ZDBjYmFmOWFhOjIwMjQwMzA5MTk6WlhkbGRqVnRja3MwT0ZOdU1rUlpTa05DTVRKNVUzaHJkSGxaYVZWWlJ6QXJZWFVyWW1WVWNIWnpNR3gyV1U1alMweFNRMmREUmtRM1NUaDRaWGR0ZFhsR2VIQTBSbEIwUjFOVlJFTk5RbVpMYkhaWmExRTlQUT09LzYvOS8yLzMvMC8yL2Jic3//_//JCQhIUAkJEBeIUAjJCRAU3Lm1wNCBvciBodHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvNGE1MzIxNWQ1MjYzZDIyODkwMWMwNjdkMGNiYWY5YWE6MjAyNDAzMDkxOTpaWGRsZGpWdGNrczBPRk51TWtSWlNrTkNNVEo1VTNocmRIbFphVlZaU//_//QEBAQEAhIyMhXl5enpBcllYVXJZbVZVY0haek1HeDJX//_//JCQjISFAIyFAIyM=VTVqUzB4U1EyZERSa1EzU1RoNFpYZHRkWGxHZUhBMFJsQjBSMU5WUkVOTlFtWkxiSFpaYTFFOVBRPT0vNi85LzIvMy8wLzIvYmJzdTcubXA0';
    const cleared = Movie.clearTrash(cdnEncoded);
    log('cleared',cleared)
    expect(cleared).toContain('ukrtelcdn.net');
  })
});
