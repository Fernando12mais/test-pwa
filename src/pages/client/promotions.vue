<script setup lang="ts">
  import { useUserStore } from '@stores/useUserStore';
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import { usePromotionsStore } from '@stores/usePromotionsStore';
  import { onlyNumbers } from '@utils/masks';
  import { orderItemAvailableService } from '@services/orderItemAvailable';
  import { useProductsStore } from '@stores/useProductsStore';
  import { focusOnInput } from '@utils/dom';
  import { formatMoney } from '@/utils/formatters';

  const UserStore = useUserStore();
  const PromotionsStore = usePromotionsStore();
  const ProductsStore = useProductsStore();

  const { createOrder } = ProductsStore;
  const { getCreditLimit } = UserStore;

  const { verifyAvailability, data: availableData } =
    orderItemAvailableService();
  const { fetchData } = PromotionsStore;

  const { data, isFetching } = storeToRefs(PromotionsStore);

  const { t } = useI18n<GlobalLocaleSchema>();

  async function verify(index: number) {
    if (!UserStore.userData?.user) return;
    formValues.value[index].verified = true;
    formValues.value[index].isFetching = true;
    await verifyAvailability({
      cdEmpresa: UserStore.userData?.user.cdEmpresa,
      cdItem: formValues.value[index].id,
      nrQuantidade: formValues.value[index].value,
    });
    formValues.value[index].isFetching = false;
    formValues.value[index].available = !!availableData.value?.disponivel;
  }

  onBeforeMount(() => {
    if (!UserStore.userData?.user?.cdEmpresa) return;
    fetchData({
      cdEmpresa: UserStore.userData.user.cdEmpresa,
      cdLocalEstoque: 1,
    }).then(() => {
      focusOnInput('id-0');
    });
  });

  const formValues = ref<
    {
      id: number;
      value: number;
      verified: boolean;
      isFetching: boolean;
      available: boolean;
    }[]
  >([]);

  async function onSubmit(index: number) {
    const field = formValues.value[index];

    if (!field.value) return;

    if (!field.available) {
      await verify(index);
      if (!availableData.value?.disponivel) return;
      field.isFetching = true;
      await createOrder({ cdItem: field.id, nrQuantidade: field.value }, true);
      await getCreditLimit();
      field.isFetching = false;
      return;
    }
    field.isFetching = true;

    await createOrder({ cdItem: field.id, nrQuantidade: field.value }, true);
    await getCreditLimit();
    field.isFetching = false;
  }

  function handleKeyNavigation(key: string, index: number) {
    if (key.toLowerCase() == 'arrowup') {
      focusOnInput(`id-${index - 1}`);
    }
    if (key.toLowerCase() == 'arrowdown') {
      focusOnInput(`id-${index + 1}`);
    }
  }

  watch(
    () => data.value,
    () => {
      if (data.value?.length) {
        formValues.value = data.value.map(item => ({
          id: item.id,
          value: 0,
          verified: false,
          isFetching: false,
          available: false,
        }));
      }
    },
    { deep: true },
  );
</script>

<template>
  <div class="flex-grow-1">
    <section class="d-none d-md-block">
      <TableExpandableRoot :loading="isFetching" height="80vh">
        <template #header>
          <th>{{ t('type') }}</th>
          <th>{{ t('subDescription') }}</th>
          <th class="short">{{ t('brand') }}</th>
          <th class="short">{{ t('old') }}</th>
          <th class="short">{{ t('manufacturer') }}</th>
          <th>{{ t('promotion') }}</th>

          <th class="short">{{ t('quantity') }}</th>
          <th class="short"></th>
        </template>

        <tr v-for="(item, index) in data" :key="item.id" class="py-4">
          <TableExpandableItem class="py-1" style="padding: 16px">{{
            item.type
          }}</TableExpandableItem>
          <TableExpandableItem>{{ item.description }}</TableExpandableItem>
          <TableExpandableItem>{{ item.brand }}</TableExpandableItem>
          <TableExpandableItem>{{ item.oldCode }}</TableExpandableItem>
          <TableExpandableItem>{{ item.manufacturer }}</TableExpandableItem>
          <TableExpandableItem>
            <div class="d-flex align-center gap-2 justify-end">
              <span class="text-decoration-line-through">
                {{ formatMoney(Number(item.sell)) }}
              </span>
              <span>
                {{ formatMoney(Number(item.promotion)) }}
              </span>
            </div>
          </TableExpandableItem>

          <TableExpandableItem>
            <VForm
              autocomplete="off"
              class="d-flex align-center gap-1"
              @submit.prevent="onSubmit(index)"
            >
              <TextFieldRoot :loading="false">
                <TextFieldInput
                  :id="`id-${index}`"
                  @on-key-down="handleKeyNavigation($event, index)"
                  density="compact"
                  style="width: 8rem"
                  :masks="[onlyNumbers]"
                  :max-length="7"
                  :label="''"
                  :clearable="false"
                  class="my-1 input-center"
                  @on-input="
                    formValues[index].value = Number($event);
                    formValues[index].verified = false;
                    formValues[index].available = false;
                  "
                />
              </TextFieldRoot>
            </VForm>
          </TableExpandableItem>

          <TableExpandableItem>
            <VForm
              autocomplete="off"
              class="d-flex align-center gap-1"
              @submit.prevent="onSubmit(index)"
            >
              <VBtn
                type="submit"
                :loading="formValues[index].isFetching"
                :color="
                  !formValues[index]?.available &&
                  formValues[index].verified &&
                  !formValues[index].isFetching
                    ? 'error'
                    : 'success'
                "
                :class="{
                  'v-btn--disabled':
                    !formValues[index].verified ||
                    !formValues[index]?.available ||
                    formValues[index].isFetching,
                }"
                @focusin="
                  if (!formValues[index]?.available && formValues[index].value)
                    verify(index);
                "
                size="small"
                class="px-1"
                style="font-size: 0.75rem"
              >
                {{
                  !formValues[index]?.available &&
                  formValues[index].verified &&
                  !formValues[index].isFetching
                    ? t('unavailable')
                    : t('buy')
                }}
              </VBtn>
            </VForm>
          </TableExpandableItem>
        </tr>
      </TableExpandableRoot>
    </section>

    <section class="d-flex d-md-none flex-column gap-3">
      <PromotionProduct
        v-for="(product, index) in data"
        :key="product.id"
        :product="{
          ...product,
          price: product.promotion,
          quantity: '0',
          oldPrice: product.sell,
        }"
        :index="index"
      />
    </section>
  </div>
</template>

<style scoped>
  .short {
    width: 1%;
    white-space: nowrap;
    text-align: center;
  }
</style>
