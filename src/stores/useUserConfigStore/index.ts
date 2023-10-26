import { defineStore } from 'pinia';

import { ConfigData } from './types';

export const useUserConfigStore = defineStore('UserConfigStore', () => {
  const storedConfig = localStorage.getItem('config');
  const config = ref<ConfigData | undefined>(
    storedConfig ? JSON.parse(storedConfig) : undefined,
  );

  function setConfig(data: ConfigData, persist = true) {
    config.value = data;

    if (persist) {
      localStorage.setItem('config', JSON.stringify(data));
    }
  }

  return { config, setConfig };
});
