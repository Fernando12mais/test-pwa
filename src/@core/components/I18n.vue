<script setup lang="ts">
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import type { I18nLanguage } from '@layouts/types';
  import { useUserConfigStore } from '@stores/useUserConfigStore';
  import { useDisplay } from 'vuetify/lib/framework.mjs';

  const props = withDefaults(defineProps<Props>(), {
    location: 'bottom end',
  });

  defineEmits<{
    (e: 'change', id: string): void;
  }>();

  interface Props {
    languages: I18nLanguage[];
    location?: any;
  }

  const { locale } = useI18n({ useScope: 'global' });
  const { config } = useUserConfigStore();
  const { t } = useI18n<GlobalLocaleSchema>();
  const route = useRoute();
  const { mdAndDown } = useDisplay();

  watch(locale, () => {
    const name = t(`routes.${route.name as string}`);

    localStorage.setItem('locale', locale.value as string);
    if (name == `routes.${route.name as string}`) return;

    if (config) {
      useHeadSafe({
        title: () => `${config?.title} - ${name}`,
      });
    } else {
      useHeadSafe({
        title: `Alfa-B2B - ${name}`,
        link: [
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
        ],
      });
    }
  });
</script>

<template>
  <VBtn
    class="d-flex justify-start justify-lg-center"
    :icon="!mdAndDown"
    variant="text"
    color="default"
    :size="!mdAndDown ? 'small' : '100%'"
  >
    <VIcon icon="tabler-language" size="24" :class="mdAndDown ? 'mr-1' : ''" />

    <VListItemTitle v-show="mdAndDown">{{
      t('messages.changeLanguage')
    }}</VListItemTitle>
    <!-- Menu -->
    <VMenu activator="parent" :location="props.location" offset="14px">
      <!-- List -->
      <VList min-width="175px">
        <!-- List item -->
        <VListItem
          v-for="lang in props.languages"
          :key="lang.i18nLang"
          :value="lang.i18nLang"
          @click="
            locale = lang.i18nLang;
            $emit('change', lang.i18nLang);
          "
          :class="{ 'bg-primary': locale == lang.i18nLang }"
        >
          <!-- Language label -->
          <VListItemTitle>{{ lang.label }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </VBtn>
</template>

<style scoped></style>
