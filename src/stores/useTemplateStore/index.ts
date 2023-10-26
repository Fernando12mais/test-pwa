import { defineStore } from 'pinia';
import { TemplateData } from './types';

export const useTemplateStore = defineStore('TemplateStore', () => {
  const data = ref<TemplateData>({ content: [] });

  return { data };
});
