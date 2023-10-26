<script setup lang="ts">
  import { useProductForm } from '@composables/useProductForm';
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import { ProcessedOrderItem } from '@/services/ordersFinished/types';
  import { formatMoney } from '@/utils/formatters';

  const props = defineProps<ProcessedOrderItem>();
  const loading = ref({ loading: props.loading });

  const { manageDeleteOrder } = useProductForm({
    ...props,
    index: 0,
    loadingRef: loading.value,
    loadingKey: 'loading',
    quantity: Number(props.quantity),
    price: Number(props.price),
  });
  const { t } = useI18n<GlobalLocaleSchema>();
</script>

<template>
  <VCard
    class="pa-2 text-start position-relative"
    :class="{ 'low-opacity': loading.loading }"
    style="color: rgba(var(--v-theme-on-surface), 0.7)"
  >
    <VRow>
      <VCol>
        <TruncatedText
          :text="`${type || ''} ${description || ''} ${brand || ''}`"
          :line-clamp="2"
        />
        <TruncatedText class="mb-0" :text="obs" :line-clamp="2" />
      </VCol>

      <VCol cols="auto">
        <button>
          <VIcon
            icon="tabler-trash"
            color="error"
            @click="manageDeleteOrder(itemId)"
          />
        </button>
      </VCol>
    </VRow>

    <VRow class="text-center">
      <VCol class="d-flex flex-column">
        <span> {{ t('quantity') }} </span>
        <span class="text-h5" style="color: inherit">
          {{ Number(quantity) }}
        </span>
      </VCol>
      <VCol class="d-flex flex-column">
        <span>{{ t('unitary') }} </span>
        <span class="text-h5" style="color: inherit">
          {{ formatMoney(Number(price)) }}</span
        >
      </VCol>
      <VCol class="d-flex flex-column">
        <span> {{ t('total') }} </span>
        <span class="text-h5" style="color: inherit">
          {{ formatMoney(Number(total)) }}
        </span>
      </VCol>
    </VRow>

    <slot></slot>
  </VCard>
</template>
