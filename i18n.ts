import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './lang/en.json';
import ru from './lang/ru.json';
import ja from './lang/ja.json';
const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
  ja:{translation:ja}
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
