import {getLocales} from 'react-native-localize';
import {useMMKVString} from 'react-native-mmkv';
import config from '../config';
import {useEffect, useState} from 'react';
import i18n from '../i18n';

export default function useLanguage(): [string, (value: string) => void] {
  const [storedLocale, setStoredLocale] = useMMKVString(config.keys.lang);
  const [locale,setLocale] = useState('');
  useEffect(() => {
    i18n.changeLanguage(locale);
    if (storedLocale != locale)
      setStoredLocale(locale);
  },[locale]);
  useEffect(() => {
    if (storedLocale)
    setLocale(storedLocale);
    else setLocale(getLocales().find(x => config.langs.includes(x.languageCode))?.languageCode ?? i18n.language)
  },[storedLocale])
  return [locale, setLocale];
}
