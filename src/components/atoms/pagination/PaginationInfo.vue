<script setup lang="ts">
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';

  defineProps<{ total: number; from: number; to: number }>();
  const { t } = useI18n<GlobalLocaleSchema>();
</script>

<template>
  <span>{{ t('messages.showingEntries', { from, to, total }) }}</span>
</template>
