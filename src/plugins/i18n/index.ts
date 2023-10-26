import { createI18n } from 'vue-i18n';
import messages from './locales/';
import { LocaleSchema } from './locales/locale.type';

const i18n = createI18n<[LocaleSchema], keyof typeof messages>({
  legacy: false,
  locale: localStorage.getItem('locale') || 'pt',
  fallbackLocale: 'en',
  messages: { ...messages },
});

export default i18n;
