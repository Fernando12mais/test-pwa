<script setup lang="ts">
  import { onlyNumbers } from '@utils/masks';

  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';

  import { useUserStore } from '@stores/useUserStore';
  import { useDisplay } from 'vuetify/lib/framework.mjs';
  import { useProductForm } from '@composables/useProductForm';
  import { useProductsStore } from '@stores/useProductsStore';
  import { ProcessedProductsResponse } from '@services/productsSearch/types';

  const props = defineProps<{
    price: number;
    manufacturerCode: string;
    id: number;
    index: number;
    defaultValue?: number;
    loading?: boolean;
  }>();

  const { data } = storeToRefs(useProductsStore());

  const {
    quantity,
    total,
    verifyAvailability,
    availability,
    isVerifyingAvailability,
    onSubmit,
    onKeyDown,
    manageCreateOrder,
  } = useProductForm({
    id: props.id,
    index: props.index,
    price: props.price,
    quantity: props.defaultValue,
    loadingRef: data.value?.results.find(
      item => item.id == props.id,
    ) as ProcessedProductsResponse['results']['0'],
    loadingKey: 'isBuying',
  });

  const UserStore = useUserStore();

  const verified = ref(false);

  const { t } = useI18n<GlobalLocaleSchema>();

  const { mdAndUp } = useDisplay();
</script>

<template>
  <VCol class="py-0" cols="12" :md="true">
    <VForm autocomplete="off" @submit.prevent="onSubmit" class="w-100">
      <div class="row">
        <VCol cols="6" md="auto">
          <label class="d-block text-caption text-center">{{
            t('unitary')
          }}</label>
          <div class="text-h4 text-center">
            {{ total.price }}
          </div>
        </VCol>
        <VCol
          cols="6"
          :md="true"
          :class="{ 'text-disabled': total.isEmpty }"
          :title="total.formattedPrice"
        >
          <label class="d-block text-caption text-center">{{
            t('total')
          }}</label>
          <div
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
            class="text-h4 text-center"
            :class="{
              'text-disabled': total.isEmpty,
            }"
          >
            {{ total.formattedPrice }}
          </div>
        </VCol>

        <VCol class="d-flex flex-column justify-center" cols="6" md="auto">
          <TextFieldRoot :loading="false" style="min-width: 100px">
            <TextFieldInput
              focused
              :default-value="defaultValue ? defaultValue.toString() : ''"
              class="input-center input-focused"
              @on-key-down="onKeyDown($event.toLowerCase())"
              :id="`id-${index}`"
              :clearable="false"
              :label="t('quantity')"
              label-on-top
              :masks="[onlyNumbers]"
              @on-input="
                quantity = Number($event);
                if (availability) availability.disponivel = false;
                verified = false;
              "
              :max-length="6"
            />
          </TextFieldRoot>
        </VCol>

        <VCol class="ps-2 d-flex flex-column justify-center" md="auto">
          <VBtn
            type="button"
            @click="
              if (availability?.disponivel) manageCreateOrder();
              else onSubmit();
            "
            @focusin="
              if (!availability?.disponivel && quantity && mdAndUp) {
                verifyAvailability({
                  cdEmpresa: UserStore?.userData?.user?.cdEmpresa as number,
                  cdItem: props.id,
                  nrQuantidade: quantity,
                });
                verified = true;
              }
            "
            :loading="isVerifyingAvailability || loading"
            :color="
              !availability?.disponivel && verified && !isVerifyingAvailability
                ? 'error'
                : 'success'
            "
            :class="{
              'v-btn--disabled':
                ((!verified ||
                  !availability?.disponivel ||
                  isVerifyingAvailability ||
                  loading) &&
                  mdAndUp) ||
                !quantity,
            }"
            min-height="48px"
          >
            <VIcon
              icon="tabler-cart-plus"
              class="mr-1"
              :class="{
                'd-none': !availability?.disponivel && !mdAndUp && verified,
              }"
              size="22"
            />
            <span
              v-if="!isVerifyingAvailability"
              class="text-caption text-md-body-1"
              style="text-transform: uppercase !important"
            >
              {{
                !availability?.disponivel && verified
                  ? t('unavailable')
                  : t('buy')
              }}
            </span>
          </VBtn>
        </VCol>
      </div>
    </VForm>
    <VDivider class="mt-2 mx-auto divider-color d-md-none" />
  </VCol>
</template>

<style scoped>
  .unit {
    text-align: center;
    font-weight: bold;
    background-color: rgb(var(--v-theme-grey-800));
  }
</style>
