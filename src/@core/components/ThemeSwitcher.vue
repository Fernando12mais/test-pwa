<script setup lang="ts">
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import { useThemeConfig } from '@core/composable/useThemeConfig';
  import type { ThemeSwitcherTheme } from '@layouts/types';
  import { useDisplay } from 'vuetify/lib/framework.mjs';

  const props = defineProps<{
    themes: ThemeSwitcherTheme[];
  }>();

  const { theme } = useThemeConfig();
  const {
    state: currentTheme,
    next: getNextThemeName,
    index: currentThemeIndex,
  } = useCycleList(
    props.themes.map(t => t.name),
    { initialValue: theme.value },
  );

  const changeTheme = () => {
    theme.value = getNextThemeName();
  };

  const getThemeIcon = computedWithControl(theme, () => {
    const nextThemeIndex =
      currentThemeIndex.value + 1 === props.themes.length
        ? 0
        : currentThemeIndex.value + 1;

    return props.themes[nextThemeIndex].icon;
  });

  watch(theme, val => {
    currentTheme.value = val;
  });

  const { mdAndDown } = useDisplay();
  const { t } = useI18n<GlobalLocaleSchema>();
</script>

<template>
  <VBtn
    class="d-flex justify-start d-lg-block"
    :icon="!mdAndDown"
    variant="text"
    color="default"
    :size="mdAndDown ? '100%' : 'small'"
    @click="changeTheme"
  >
    <VIcon :icon="getThemeIcon" size="24" :class="mdAndDown ? 'mr-1' : ''" />

    <VListItemTitle v-show="mdAndDown">{{
      t('messages.changeTheme')
    }}</VListItemTitle>
  </VBtn>
</template>
