import {MMKV} from 'react-native-mmkv';
import { VideoQuality } from '../logic/movie';
export const wtStorage = new MMKV({id: 'app-watchtime'});

export function clearWT() {
  wtStorage.clearAll();
}
export type WatchTime = {
    secondsWatched:number;
    videoQuality: VideoQuality;
}
export function getWatchTime(id:string):WatchTime | null{
    if (!wtStorage.contains(id)) return null;
    const str = wtStorage.getString(id);
    if (!str) return null;
    return JSON.parse(str);
}
export function saveWatchTime(id:string,wt: WatchTime) {
    wtStorage.set(id,JSON.stringify(wt));
}