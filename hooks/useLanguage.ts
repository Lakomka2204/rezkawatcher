import {getLocales} from 'react-native-localize';
import {useMMKVString} from 'react-native-mmkv';
import config from '../config';
import {useEffect} from 'react';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';
type TFunction = typeof i18n.t;
export default function useLanguage(): [
  TFunction,
  string,
  (value: string) => void,
] {
  const [storedLocale, setStoredLocale] = useMMKVString(config.keys.lang);
  const [t] = useTranslation();
  
  useEffect(() => {
    async function reload() {
      const defaultLang = 
      storedLocale ??
        getLocales().find(x => config.langs.includes(x.languageCode))
          ?.languageCode ??
        i18n.language;
        await i18n.changeLanguage(defaultLang)
        if (!storedLocale) {
          console.log('no stored lang, setting',defaultLang,'available',getLocales().map(x=> x.languageCode));
          setStoredLocale(defaultLang);
        }
    }
    reload();
  }, [storedLocale]);
  function setLocale(value: string) {
    setStoredLocale(value);
  }
  
  return [t, storedLocale!, setLocale];
}
