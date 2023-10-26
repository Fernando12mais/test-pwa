import en from './en';

export type LocaleSchema = typeof en;

export type GlobalLocaleSchema = {
  message: LocaleSchema;
};
