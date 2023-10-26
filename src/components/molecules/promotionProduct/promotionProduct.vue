<script setup lang="ts">
  import { ProcessedOrderItem } from '@services/ordersFinished/types';
  import { formatMoney } from '@utils/formatters';
  import { onlyNumbers } from '@utils/masks';
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import { useProductForm } from '@composables/useProductForm';

  type Props = {
    product: Pick<
      ProcessedOrderItem,
      'brand' | 'loading' | 'price' | 'quantity' | 'id' | 'description'
    > & { oldPrice?: number | string };
    deletable?: boolean;
    index: number;
  };
  const props = defineProps<Props>();
  const { t } = useI18n<GlobalLocaleSchema>();

  const loading = ref({ loading: props.product.loading });

  const {
    quantity,
    total,
    availability,
    isVerifyingAvailability,
    onSubmit,
    onKeyDown,
  } = useProductForm({
    id: props.product.id,
    index: props.index,
    price: Number(props.product.price),
    quantity: Number(props.product.quantity),
    loadingRef: loading.value,
    loadingKey: 'loading',
    oldPrice: Number(props.product.oldPrice || 0),
  });
</script>

<template>
  <VCard
    class="elevate-2 px-1 py-2 position-relative"
    :class="{ 'low-opacity': loading.loading }"
  >
    <p class="text-center font-weight-medium mx-auto" style="max-width: 85%">
      {{ `${product.description}` }}
    </p>

    <VForm autocomplete="off" @submit.prevent="onSubmit" class="w-100">
      <ul>
        <li class="d-flex align-center justify-space-between gap-2">
          <TextFieldRoot :loading="false">
            <TextFieldInput
              focused
              :default-value="quantity.toString()"
              class="input-center input-focused"
              @on-key-down="onKeyDown($event.toLowerCase())"
              :id="`id-${index}`"
              :clearable="false"
              :label="t('quantity')"
              label-on-top
              :masks="[onlyNumbers]"
              @on-input="
                quantity = Number($event);
                if (availability) availability = null;
              "
              :max-length="6"
            />
          </TextFieldRoot>

          <VBtn
            type="submit"
            min-height="3rem"
            :loading="isVerifyingAvailability || loading.loading"
            :color="
              availability?.disponivel == false && !isVerifyingAvailability
                ? 'error'
                : 'success'
            "
          >
            {{
              availability?.disponivel == false ? t('unavailable') : t('buy')
            }}</VBtn
          >
        </li>

        <li class="d-flex justify-space-between row text-center">
          <VCol class="d-flex flex-column">
            <span>{{ t('unitary') }}: </span>

            <span
              v-if="product.oldPrice"
              class="text-body-1 text-decoration-line-through"
            >
              {{ formatMoney(product.oldPrice) }}
            </span>
            <span class="text-h6">
              {{ formatMoney(Number(product.price || 0)) }}
            </span>
          </VCol>
          <VCol class="d-flex flex-column">
            <span>{{ t('total') }}: </span>
            <span
              v-if="product.oldPrice && quantity"
              class="text-body-1 text-decoration-line-through"
            >
              {{ total.calculatedOldPrice }}
            </span>
            <span class="text-h6">
              {{ total.formattedPrice }}
            </span>
          </VCol>
        </li>
      </ul>
    </VForm>
  </VCard>
</template>

<style scoped>
  .btn-trash {
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
