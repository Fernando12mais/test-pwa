<script lang="ts" setup>
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';

  defineProps<{
    code: number;
    similars: number[];
    images: string[];
    loading?: boolean;
    resultIds?: number[];
    isSimilar?: boolean;
    similarIndex?: number;
  }>();
  defineEmits<{ onGetSimilars: [similars: number[]] }>();

  const { t } = useI18n<GlobalLocaleSchema>();
</script>

<template>
  <VCol
    class="d-flex align-center justify-center py-0"
    cols="12"
    md="auto"
    style="min-width: 100px"
  >
    <div class="row flex-md-column">
      <VCol class="pt-2">
        <ExpandableImageRoot
          :images="images"
          max-width="100px"
          max-height="80px"
          width="100%"
          class="d-none d-md-block mx-auto"
          side-to-side
        />
      </VCol>
      <VCol>
        <p class="text-center my-0">
          {{ code }}
        </p>
      </VCol>
      <VCol v-if="similars.length">
        <VBtn
          size="small-x"
          v-if="!isSimilar"
          :loading="loading"
          @click="$emit('onGetSimilars', similars)"
          class="mb-0 text-center text-caption px-1 font-weight-bold"
          :disabled="!similars.length || loading"
          variant="outlined"
          color="on-primary"
        >
          <span class="text-black" style="color: rgb(var(--v-theme-grey-800))">
            {{ t('messages.seeSimilars') }}</span
          >
        </VBtn>

        <span v-else class="text-center">
          {{ t('similar') }}: {{ similarIndex }}/{{ similars.length }}
        </span>
      </VCol>
    </div>
  </VCol>
</template>
