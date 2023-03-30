import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './translations/en.js';
import fr from './translations/fr.js';
import es from './translations/es.js';
import * as RNLocalize from 'react-native-localize';

const resources = {
  en,
  fr,
  es,
};

const {languageTag} = RNLocalize.findBestAvailableLanguage(
  Object.keys(resources),
);

i18n.use(initReactI18next).init({
  resources,
  compatibilityJSON: 'v3',
  lng: languageTag,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});
