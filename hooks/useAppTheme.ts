import {DarkTheme, DefaultTheme, Theme} from '@react-navigation/native';
import {AppTheme} from '../utils/types';
import {useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {useMMKVString} from 'react-native-mmkv';
import config from '../config';
export interface ThemeHook {
  value: AppTheme;
  theme: Theme;
}
export default function useAppTheme(): [ThemeHook, (value: AppTheme) => void] {
  const [storedTheme, setStoredTheme] = useMMKVString(config.keys.theme);
  const colorTheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeHook>({
    theme: DefaultTheme,
    value: storedTheme as AppTheme,
  });
  useEffect(() => {
    console.log('storage change', storedTheme);
    switch (storedTheme) {
      case 'system':
        setTheme(
          colorTheme === 'dark'
            ? {theme: DarkTheme, value: storedTheme}
            : {theme: DefaultTheme, value: storedTheme},
        );
        break;
      case 'light':
        setTheme({theme: DefaultTheme, value: storedTheme});
        break;
      case 'dark':
        setTheme({theme: DarkTheme, value: storedTheme});
        break;
      default:
        setTheme({theme: DefaultTheme, value: 'system'});
        console.log('setting system theme');
        setStoredTheme('system');
        break;
    }
  }, [storedTheme, colorTheme]);
  function setAppTheme(theme: AppTheme) {
    setStoredTheme(theme.toString());
  }
  return [theme, setAppTheme];
}
