<script setup lang="ts">
  import { useTheme } from 'vuetify';
  import { useThemeConfig } from '@core/composable/useThemeConfig';
  import { hexToRgb } from '@layouts/utils';
  import { configService } from '@services/config/index';
  import { ConfigResponse } from '@services/config/types';

  import { useUserConfigStore } from '@stores/useUserConfigStore';
  import { useToastStore } from '@stores/useToastStore';

  const ToastStore = useToastStore();
  const { clearToast } = ToastStore;
  const { toasts } = storeToRefs(ToastStore);

  const {
    syncInitialLoaderTheme,
    syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
    isAppRtl,
    setPrimaryColor,
  } = useThemeConfig();

  const vuetifyTheme = useTheme();
  const { setConfig } = useUserConfigStore();

  // ℹ️ Sync current theme with initial loader theme
  syncInitialLoaderTheme();
  syncConfigThemeWithVuetifyTheme();

  configService.get().then(() => {
    if (!configService.data.value || configService.statusCode.value == 204) {
      localStorage.removeItem('config');
      return;
    }
    const data = JSON.parse(
      configService.data.value as string,
    ) as ConfigResponse;

    setConfig({
      title: data.txTituloPagina,
      color: data.dsColor,
      images: {
        favicon: data.txUrlFavicon,
        login: data.txUrlImagemLogin,
        loginBg: data.txUrlImagemCapa,
        logo: data.txUrlLogotipo,
      },
    });

    setPrimaryColor(data.dsColor, vuetifyTheme);
  });
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp
      :style="`--v-global-theme-primary: ${hexToRgb(
        vuetifyTheme.global.current.value.colors.primary,
      )}`"
    >
      <RouterView />
      <ToastRoot>
        <ToastBody
          v-for="toast in toasts"
          :key="toast.id"
          :toast="toast"
          @on-animation-end="clearToast(toast.id)"
          >{{ toast.message }}</ToastBody
        >
      </ToastRoot>
    </VApp>
  </VLocaleProvider>
</template>
