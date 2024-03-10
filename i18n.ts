import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './lang/en.json';
import ru from './lang/ru.json';
import jp from './lang/jp.json';
const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
  jp:{translation:jp}
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
