import {MMKV} from 'react-native-mmkv';
import {HistoryMovie} from '../logic/movie';

export const historyStorage = new MMKV({id: 'app-history'});
export function clearHistory() {
  historyStorage.clearAll();
}
export function getHistoryMovie(id: string): HistoryMovie | null {
  const movieString = historyStorage.getString(id);
  if (!movieString) return null;
  return JSON.parse(movieString!);
}
export function getAllMovies(): HistoryMovie[] {
  const keys = historyStorage.getAllKeys();
  const movies: HistoryMovie[] = [];
  for (const key of keys) {
    if (historyStorage.contains(key)) {
      const mv = getHistoryMovie(key);
      if (mv) movies.push(mv);
    }
  }
  return movies.sort(
    (a, b) => (b?.whenWatched ?? 0) - (a?.whenWatched ?? 0)
  );
}
export function addToHistory(movie: HistoryMovie) {
  historyStorage.set(movie.id, JSON.stringify(movie));
}
