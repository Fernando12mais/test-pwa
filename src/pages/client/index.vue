<script setup lang="ts">
  import { FilterOption } from '@stores/useFilterStore/types';
  import { useFilterStore } from '@stores/useFilterStore';
  import { useProductsStore } from '@stores/useProductsStore';
  import { useUserStore } from '@stores/useUserStore';

  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';

  import { useField, useForm } from 'vee-validate';
  import { productSearchSchema } from '@validators/client';
  import {
    ProcessedProductsResponse,
    ProductsSearchPayload,
  } from '@services/productsSearch/types';
  import { focusOnInput } from '@utils/dom';
  import format from 'date-fns/format';
  import { formatMoney } from '@utils/formatters';
  import { OrderCreatePayload } from '@services/orderCreate/types';
  import { useDisplay } from 'vuetify/lib/framework.mjs';
  import { formatVehiclePlate, formatCreditCard } from '@utils/masks';

  const ProductsStore = useProductsStore();

  const {
    data: products,
    activeFilters,
    isSearchingProduct,
    page,
    finishedOrders,
    isFetchingOrders,
    order,
    isFetchingOpenOrder,
    paymentForms,
    carriers,
    dueDate,
    isFetchingCarriers,
    isFetchingPaymentForm,
    isFetchingDueDate,
    isFetchingProperties,
    searchProperties,
    isFetchingVehiclePlate,
    vehiclePlate,
    isFetchingDeleteOrder,
    highlightOrderText,
    orderFinishStatusCode,
    orderFinishError,
  } = storeToRefs(ProductsStore);

  const {
    search,
    reset: resetProducts,
    selectUnselectFilter,
    getFinishedOrders,
    getOpenOrder,
    fetchSimilars,
    getPaymentForms,
    getCarriers,
    getDueDate,
    getProperties,
    getVehiclePlate,
    deleteOrder,
    finishOrder,
    updateOrder,
  } = ProductsStore;

  const results = computed(() => products.value?.results || []);
  const { mdAndUp } = useDisplay();

  const { list, containerProps, scrollTo, wrapperProps } = useVirtualList(
    results,
    {
      itemHeight: mdAndUp.value ? 200 : 350,
    },
  );
  const userStore = useUserStore();

  const { creditLimit, isFetchingCreditLimit } = storeToRefs(userStore);

  const filterStore = useFilterStore();
  const { t } = useI18n<GlobalLocaleSchema>();
  const modal = ref(false);
  const isDrawerOpen = ref(false);
  const isSendModalOpen = ref(false);
  const searched = ref(false);
  const {
    closeFilter,
    openFilter,
    searchBrands,
    onPageChange,
    onSearch,
    selectUnselectFilter: selectUnselectModalFilter,
  } = filterStore;

  const { isFilterOpen, filterModalData, defaultFindParams, selectedFilters } =
    storeToRefs(filterStore);

  const { handleSubmit, resetForm } = useForm({
    validationSchema: productSearchSchema,
  });
  const generalSearch = useField<string>('generalSearch');
  const brand = useField<string>('brand');
  const side = useField<string>('side');
  const extremity = useField<string>('extremity');
  const position = useField<string>('position');
  const reference = useField<string>('reference');
  const plate = useField<string>('plate');
  const application = useField<string>('application');

  const params = useUrlSearchParams('history');
  const router = useRouter();

  const searchBarIsOpen = ref(true);

  const { smAndUp } = useDisplay();
  const carrierValue = ref('');
  const dueDateValue = ref<string | undefined>('');

  const paymentValue = ref('');
  const pickupAtCounter = ref(false);

  const dueDateLabels = computed(() => dueDate.value?.map(item => item.label));
  const carriersLabels = computed(
    () => carriers.value?.map(item => item.label),
  );

  const filledSearchFields = computed(() => {
    return [
      {
        label: t('messages.generalSearch'),
        value: params.generalSearch as string,
      },
      { label: t('application'), value: params.application as string },
      { label: t('brand'), value: params.brand as string },
      { label: t('reference'), value: params.reference as string },
      { label: t('position'), value: params.position as string },
      { label: t('side'), value: params.side as string },
      { label: t('extremity'), value: params.extremity as string },
    ].filter(item => item.value);
  });

  const activeSidebarFilters = computed(() =>
    activeFilters.value.map(item => item.title),
  );

  const filterToSearch = computed<ProductsSearchPayload['txSearchSidebar']>(
    () =>
      activeFilters.value
        .map(item => {
          if (item.level == 1)
            return {
              cdTipo: item.father?.value as number,
              dsSubDescricao: item.title,
            };
          if (item.level == 2)
            return {
              cdTipo: item.father?.father?.value as number,
              dsSubDescricao: item.father?.title,
              cdMarca: item.value,
            };

          return { cdTipo: item.value as number };
        })
        .filter(item => {
          const toStay = activeFilters.value.reduce((acc, activeFilter) => {
            if (
              activeFilter.father?.value == item.cdTipo &&
              !item.dsSubDescricao
            ) {
              acc = false;
            }

            if (
              (activeFilter.level || 0) > 1 &&
              activeFilter.father?.title == item.dsSubDescricao &&
              !item.cdMarca
            ) {
              acc = false;
            }

            return acc;
          }, true);

          return toStay;
        }),
  );

  function clear() {
    searched.value = false;

    resetForm();

    for (const key in params) {
      params[key] = '';
    }
    localStorage.removeItem('orderQueryParams');
  }

  async function handleDueDate(paymentId: number) {
    await getDueDate(paymentId);

    updateOrder({ cdFormaPagamento: paymentId });

    if (dueDate.value?.length) dueDateValue.value = undefined;
  }

  function searchProduct(
    data?: Partial<ProductsSearchPayload>,
    noFocus = false,
  ) {
    searched.value = true;

    search({
      filterId: data?.filterId,
      txSearchSidebar: filterToSearch.value,
      cdMarca: selectedFilters.value.map(item => Number(item.value)),
      txSearch: params.generalSearch as string,
      dsLado: params.side as string,
      dsPosicao: params.position as string,
      dsExtremidade: params.extremity as string,
      dsMarca: params.brand as string,
      dsReferencia: params.reference as string,
      txAplicacao: params.application as string,
      page: page.value,
      sidebar: { ...data?.sidebar },
      loadingType: [],
      ...data,
    }).then(async () => {
      if (noFocus) return;
      await nextTick();
      if (smAndUp.value)
        setTimeout(() => {
          focusOnInput('id-0');
        }, 100);
    });

    if (!noFocus) scrollTo(0);
  }

  const onSubmit = handleSubmit(async () => {
    await search({
      txSearchSidebar: [],
      cdMarca: selectedFilters.value.map(item => Number(item.value)),
      txSearch: params.generalSearch as string,
      dsLado: params.side as string,
      dsPosicao: params.position as string,
      dsExtremidade: params.extremity as string,
      dsMarca: params.brand as string,
      dsReferencia: params.reference as string,
      txAplicacao: params.application as string,
      page: 1,
      loadingType: ['search'],
    });
    resetProducts(['filters', 'page']);
    searched.value = true;

    if (products.value?.results.length) searchBarIsOpen.value = false;

    scrollTo(0);

    await nextTick();

    setTimeout(() => {
      focusOnInput('id-0');
    }, 300);
  });

  const onSubmitPlate = async () => {
    if (!plate.value.value) return;

    params.plate = plate.value.value;
    await getVehiclePlate(params.plate.replace('-', '') as string).then(() => {
      if (vehiclePlate.value?.brand && vehiclePlate.value?.modelYear) {
        params.application = `${vehiclePlate.value.model} ${vehiclePlate.value.modelYear}`;
        onSubmit();
      }
    });
  };

  function onFilterChange(filterOption: FilterOption, isExpanding?: boolean) {
    const isSelected = !isExpanding
      ? selectUnselectFilter(filterOption.id)
      : false;

    resetProducts(['page']);

    function expandFilter(data?: Partial<ProductsSearchPayload>) {
      if (!filterOption.subgroup?.length && isExpanding) {
        searchProduct(
          {
            sidebar: { cdTipo: filterOption.value },
            filterId: filterOption.id,
            loadingType: ['filters'],
            ...data,
          },
          true,
        );
        return true;
      }
      if (isExpanding) return true;

      return false;
    }

    const requests = {
      'level-0': () => {
        if (expandFilter()) return;
        searchProduct(
          isSelected
            ? {
                sidebar: { cdTipo: filterOption.value },
                filterId: filterOption.id,
                loadingType: ['search', 'filters'],
              }
            : {
                loadingType: ['search'],
              },
        );
      },
      'level-1': () => {
        if (
          expandFilter({
            sidebar: {
              cdTipo: filterOption.father?.value,
              dsSubDescricao: filterOption.title,
            },
          })
        )
          return;
        searchProduct(
          isSelected
            ? {
                sidebar: {
                  cdTipo: filterOption.father?.value,
                  dsSubDescricao: filterOption.title,
                },
                filterId: filterOption.id,
                loadingType: ['search', 'filters'],
              }
            : {
                sidebar: { cdTipo: filterOption.father?.value },
                filterId: filterOption.id,
                loadingType: ['search'],
              },
        );
      },

      default: () => {
        searchProduct({ loadingType: ['search'] });
        console.log('default');
      },
    };

    (
      requests[`level-${filterOption.level}` as keyof typeof requests] ||
      requests.default
    )();
  }

  function openModal() {
    openFilter();

    if (!filterModalData?.value?.data?.length)
      searchBrands(defaultFindParams.value);
  }

  function manageInfiniteScroll(element: HTMLDivElement) {
    if (isSearchingProduct.value.pagination || products.value?.end) return;
    const total = element.scrollHeight;
    const currentScroll = element.scrollTop + element.clientHeight;
    const percentage = (currentScroll * 100) / total;

    if (percentage >= 95) {
      page.value += 1;
      searchProduct({ page: page.value, loadingType: ['pagination'] }, true);
    }
  }

  onBeforeMount(() => {
    getOpenOrder();
    getProperties();
    if (params.plate) {
      plate.value.value = params.plate as string;
    }
  });

  const handleSend = () => {
    if (!order.value) return;

    pickupAtCounter.value = !!order.value.getOnSite;
    isSendModalOpen.value = true;
    getDueDate(order.value.paymentFormId).then(() => {
      dueDateValue.value =
        dueDate.value.find(item => item.id == order.value?.dueDateId)?.label ||
        '';
    });
    getPaymentForms().then(() => {
      paymentValue.value =
        paymentForms.value?.find(item => order.value?.paymentFormId == item.id)
          ?.label || '';
    });
    getCarriers().then(() => {
      carrierValue.value =
        carriers.value?.find(item => order.value?.carrierId == item.id)
          ?.label || '';
    });
  };
  const applyFilters = async () => {
    isDrawerOpen.value = false;
    searchBarIsOpen.value = false;

    await nextTick();

    setTimeout(() => {
      focusOnInput('id-0');
    }, 300);
  };

  watch(params, () => {
    localStorage.setItem('orderQueryParams', JSON.stringify(params));
    router.push({ query: params });
  });
</script>

<template>
  <VRow class="match-height d-flex">
    <VCol
      class="filter-wrapper d-none d-md-flex"
      v-if="products?.results?.length && smAndUp"
      :cols="isDrawerOpen ? 3 : 1"
      :style="{ maxWidth: !isDrawerOpen ? '2rem' : '17rem' }"
    >
      <DrawerRoot
        scrim
        style="position: static; width: 100%; max-height: 80vh"
        @on-change="isDrawerOpen = !isDrawerOpen"
        :open="isDrawerOpen"
      >
        <FilterRoot :loading="false" @on-filter-change="onFilterChange">
          <FilterBody
            :max-level="2"
            v-if="products.types.length"
            :data="{ filters: products.types }"
            :active-filters="activeSidebarFilters"
            :loading="isSearchingProduct.filters"
          />
        </FilterRoot>
      </DrawerRoot>
    </VCol>
    <VCol class="pt-0 px-0 d-flex flex-column">
      <main
        style="display: flex; flex: 1; flex-direction: column"
        :style="{
          maxHeight: smAndUp || !searchBarIsOpen ? 'calc(100vh - 6.25rem)' : '',
        }"
      >
        <TableExpandableRoot :loading="isFetchingOpenOrder">
          <template #header>
            <th class="short text-center">{{ t('number') }}</th>
            <th class="text-center">{{ t('date') }}</th>
            <th class="short">{{ t('messages.qtdItem') }}</th>
            <th class="short text-center">{{ t('messages.qtdUnit') }}</th>
            <th class="short text-center">{{ t('total') }}</th>
            <th style="width: 1%">
              <PopoverRoot location="bottom">
                <template #trigger>
                  <VBtn
                    @click="
                      modal = true;
                      getFinishedOrders();
                    "
                    size="x-small"
                  >
                    <VIcon size="1.2rem" icon="tabler-file-check" />
                  </VBtn>
                </template>
                <PopoverBody> {{ t('messages.sendedOrders') }}</PopoverBody>
              </PopoverRoot>
            </th>
          </template>
          <TableExpandableList v-if="order">
            <TableExpandableItem>{{ order.id }}</TableExpandableItem>
            <TableExpandableItem>{{
              format(order.createdAt, 'dd/MM/yyyy HH:mm:ss')
            }}</TableExpandableItem>
            <TableExpandableItem
              :class="{
                'highlight-text': highlightOrderText,
              }"
              >{{ order?.quantity }}</TableExpandableItem
            >

            <TableExpandableItem
              @animationend="
                highlightOrderText = false;
                highlightOrderText = false;
              "
              :class="{
                'highlight-text': highlightOrderText,
              }"
              >{{ order?.totalQuantity }}</TableExpandableItem
            >

            <TableExpandableItem
              class="text-end"
              :class="{
                'highlight-text': highlightOrderText,
              }"
              >{{ formatMoney(Number(order?.total)) }}</TableExpandableItem
            >
            <TableExpandableItem>
              <VBtn @click.stop="handleSend" color="success" size="small">{{
                t('send')
              }}</VBtn>
            </TableExpandableItem>
            <template #expandable-content>
              <TableExpandableRoot :loading="false">
                <template #header>
                  <th></th>
                  <th>Cód</th>
                  <th>Tipo</th>
                  <th>Item</th>
                  <th>Obs</th>
                  <th>Medida</th>
                  <th>Marca</th>
                  <th>QTD</th>
                  <th>V.Unit</th>
                  <th>V.total</th>
                </template>
                <tr
                  v-for="item in order?.itens"
                  :class="{ 'text-disabled': isFetchingDeleteOrder }"
                  :key="item.id"
                >
                  <TableExpandableItem>
                    <button @click="deleteOrder(item.itemId)">
                      <VIcon icon="tabler-trash-x" color="error" />
                    </button>
                  </TableExpandableItem>
                  <TableExpandableItem>{{ item.id }}</TableExpandableItem>
                  <TableExpandableItem>{{ item.type }}</TableExpandableItem>
                  <TableExpandableItem>{{ item.itemId }}</TableExpandableItem>
                  <TableExpandableItem :clamp="2" :title="item.obs">{{
                    item.obs
                  }}</TableExpandableItem>
                  <TableExpandableItem>{{ item.size }}</TableExpandableItem>
                  <TableExpandableItem>{{ item.brand }}</TableExpandableItem>
                  <TableExpandableItem>{{
                    Number(item.quantity)
                  }}</TableExpandableItem>
                  <TableExpandableItem class="text-end">{{
                    formatMoney(Number(item.price))
                  }}</TableExpandableItem>
                  <TableExpandableItem class="text-end">{{
                    formatMoney(Number(item.total))
                  }}</TableExpandableItem>
                </tr>
              </TableExpandableRoot>
            </template>
          </TableExpandableList>
        </TableExpandableRoot>

        <VForm class="my-3" @submit="onSubmit" autocomplete="off">
          <VCard
            @click="if (!searchBarIsOpen) searchBarIsOpen = true;"
            :style="{
              overflow: 'visible',
              cursor: searchBarIsOpen ? 'default' : 'pointer',
            }"
            class="my-0 px-0 position-relative"
          >
            <button
              v-if="searchBarIsOpen"
              type="button"
              @click="
                searchBarIsOpen = false;
                $event.stopPropagation();
              "
              class="search-activator-open"
            >
              <VIcon color="primary" :icon="`tabler-circle-arrow-up-filled`" />
            </button>

            <VList
              class="my-0 py-0"
              :opened="!searchBarIsOpen ? ['fields'] : []"
            >
              <VListGroup class="my-0 py-0" value="fields">
                <div
                  v-if="filledSearchFields.length"
                  class="d-flex flex-wrap align-center px-2 py-1 filled-fields-wrapper"
                >
                  <div
                    :title="field.label"
                    v-for="field in filledSearchFields"
                    :key="field.label"
                    class="d-flex flex-column"
                  >
                    <span class="small">{{ field.label }}</span>
                    <span
                      class="text-center text-primary"
                      style="line-height: 1"
                      >{{ field.value.toUpperCase() }}</span
                    >
                  </div>
                  <span class="ms-auto ps-2 d-flex gap-1">
                    <VBtn
                      color="primary"
                      icon="tabler-filter"
                      rounded="lg"
                      density="comfortable"
                      @click="
                        isDrawerOpen = !isDrawerOpen;
                        $event.stopPropagation();
                      "
                    ></VBtn>
                    <VBtn @click="searchBarIsOpen = true">{{
                      t('messages.changeSearch')
                    }}</VBtn>
                  </span>
                </div>

                <VListItem
                  v-else
                  @click="searchBarIsOpen = !searchBarIsOpen"
                  class="text-center"
                  active-color="primary"
                >
                  <template #prepend>
                    <v-btn
                      class="d-md-none"
                      color="primary"
                      icon="tabler-filter"
                      rounded="lg"
                      :disabled="isSearchingProduct.search"
                      :loading="isSearchingProduct.search"
                      @click="
                        isDrawerOpen = true;
                        $event.stopPropagation();
                      "
                    ></v-btn>
                  </template>

                  {{ t('messages.clickHereToChangeYourSearchOptions') }}
                </VListItem>
              </VListGroup>
            </VList>

            <VList
              class="my-0 py-0"
              style="padding: 0.375rem"
              :opened="searchBarIsOpen ? ['search'] : []"
            >
              <VListGroup
                active-color="primary"
                class="my-0 py-0"
                value="search"
                style="overflow: hidden"
              >
                <VRow class="my-0">
                  <!-- <VCol cols="12" md="2">
                    <VCard
                      class="px-4 py-2"
                      style="
                        overflow: visible;
                        cursor: default;
                        background-color: rgb(var(--v-theme-grey-200));
                      "
                    >
                      <h5 class="font-weight-bold">
                        {{ t('messages.searchVehicleByLicensePlate') }}
                      </h5>

                      <TextFieldRoot
                        class="position-relative"
                        :loading="
                          isSearchingProduct.search || isFetchingVehiclePlate
                        "
                      >
                        <TextFieldInput
                          type="search"
                          class="upper"
                          label-on-top
                          label=""
                          :error-messages="
                            plate.errorMessage.value &&
                            t(plate.errorMessage.value)
                          "
                          @on-input="plate.value.value = $event"
                          :clearable="false"
                          placeholder="AAA-9999"
                          :masks="[formatVehiclePlate]"
                          append-inner-icon="tabler-search"
                          :default-value="params.plate?.toString()"
                        />

                        <VBtn
                          style="
                            position: absolute;
                            right: 10px;
                            top: 24px;
                            translate: 0 -50%;
                          "
                          @click="onSubmitPlate"
                          size="28"
                          type="submit"
                          prepend-icon="tabler-search"
                          :disabled="isSearchingProduct.search"
                          :loading="isSearchingProduct.search"
                        />
                      </TextFieldRoot>
                    </VCard>
                  </VCol> -->
                  <VCol>
                    <VRow class="px-1 py-0 position-relative">
                      <VCol cols="12" :md="4">
                        <TextFieldRoot :loading="!!!!isSearchingProduct.search">
                          <TextFieldInput
                            type="search"
                            class="upper"
                            v-model="params.generalSearch"
                            label-on-top
                            :label="t('messages.generalSearch')"
                            :error-messages="generalSearch.errorMessage.value"
                            :clearable="false"
                          />
                        </TextFieldRoot>
                      </VCol>
                      <VCol cols="12" :md="4">
                        <TextFieldRoot :loading="!!isSearchingProduct.search">
                          <TextFieldInput
                            type="search"
                            class="upper"
                            label-on-top
                            :label="t('application')"
                            v-model="params.application"
                            :error-messages="application.errorMessage.value"
                            :clearable="false"
                          />
                        </TextFieldRoot>
                      </VCol>
                      <VCol cols="12" :md="4">
                        <TextFieldRoot :loading="!!isSearchingProduct.search">
                          <TextFieldInput
                            class="upper"
                            label-on-top
                            :label="t('brand')"
                            v-model="params.brand"
                            :error-messages="brand.errorMessage.value"
                            :clearable="false"
                          >
                            <VBtn
                              @click="openModal"
                              icon="tabler-filter"
                              density="compact"
                            />
                          </TextFieldInput>
                        </TextFieldRoot>
                      </VCol>

                      <VCol cols="12" :md="2">
                        <TextFieldRoot :loading="!!isSearchingProduct.search">
                          <TextFieldInput
                            type="search"
                            class="upper"
                            label-on-top
                            :label="t('reference')"
                            v-model="params.reference"
                            :error-messages="reference.errorMessage.value"
                            :clearable="false"
                          />
                        </TextFieldRoot>
                      </VCol>

                      <VCol class="d-flex" cols="12" md>
                        <VRow>
                          <VCol style="min-width: 7rem" cols="12" md="4">
                            <SkeletonRoot
                              v-if="isFetchingProperties"
                              :height="48"
                            />
                            <VSelect
                              v-else
                              :label="t('position')"
                              v-model="params.position"
                              :error-messages="position.errorMessage.value"
                              :items="searchProperties?.position"
                              density="comfortable"
                              variant="outlined"
                              persistent-placeholder
                              clearable
                            >
                            </VSelect>
                          </VCol>
                          <VCol style="min-width: 7rem" cols="12" md="4">
                            <SkeletonRoot
                              v-if="isFetchingProperties"
                              :height="48"
                            />
                            <VSelect
                              v-else
                              :label="t('side')"
                              v-model="params.side"
                              :error-messages="side.errorMessage.value"
                              :items="searchProperties?.side"
                              density="comfortable"
                              variant="outlined"
                              persistent-placeholder
                              clearable
                            />
                          </VCol>
                          <VCol style="min-width: 7rem" cols="12" md="4">
                            <SkeletonRoot
                              v-if="isFetchingProperties"
                              :height="48"
                            />
                            <VSelect
                              v-else
                              :label="t('extremity')"
                              v-model="params.extremity"
                              :error-messages="extremity.errorMessage.value"
                              :items="searchProperties?.extremity"
                              density="comfortable"
                              variant="outlined"
                              persistent-placeholder
                              clearable
                            />
                          </VCol>
                        </VRow>
                      </VCol>

                      <VCol cols="auto" class="d-flex gap-2">
                        <VBtn
                          v-if="searchBarIsOpen"
                          height="3rem"
                          :disabled="isSearchingProduct.search"
                          :loading="isSearchingProduct.search"
                          @click="
                            isDrawerOpen = !isDrawerOpen;
                            $event.stopPropagation();
                          "
                        >
                          <VIcon
                            color="white"
                            size="25"
                            :icon="`tabler-filter`"
                          />
                        </VBtn>
                        <VBtn
                          height="3rem"
                          :prepend-icon="smAndUp ? 'tabler-search' : ''"
                          :disabled="isSearchingProduct.search"
                          :loading="isSearchingProduct.search"
                          type="submit"
                        >
                          {{ t('search') }}</VBtn
                        >
                        <VBtn
                          variant="outlined"
                          height="3rem"
                          color="error"
                          :disabled="isSearchingProduct.search"
                          :loading="isSearchingProduct.search"
                          @click="clear"
                        >
                          {{ t('clear') }}
                        </VBtn>
                      </VCol>
                    </VRow>

                    <VRow class="px-1">
                      <VCol>
                        <VChip
                          v-for="activeBrandFilter in selectedFilters"
                          :key="activeBrandFilter.value"
                          closable
                          :text="activeBrandFilter.title"
                          variant="elevated"
                          color="primary"
                          @click:close="
                            selectUnselectModalFilter(activeBrandFilter);
                            searchProduct();
                            resetProducts(['filters']);
                          "
                        />
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>
              </VListGroup>
            </VList>
          </VCard>
        </VForm>

        <VRow
          v-if="
            !products?.results?.length && !isSearchingProduct.search && searched
          "
        >
          <VCol class="text-center">
            <h3>
              {{ t('messages.noProductsFound') }}
            </h3>
          </VCol>
        </VRow>

        <VirtualizationRoot
          :class="{ 'd-none': !smAndUp && searchBarIsOpen }"
          v-if="products?.results?.length"
          @scroll="manageInfiniteScroll($event.target as HTMLDivElement)"
          :container-props="containerProps"
          :wrapper-props="wrapperProps"
        >
          <VRow v-for="product in list" :key="product.index">
            <VCol class="d-flex flex-column">
              <ProductCardRoot
                :class="{ 'highlight-bg': product.data.isSimilar }"
                :loading="page == 1 && !!isSearchingProduct.search"
              >
                <ProductCardHeader
                  :highlight="{
                    title: params.generalSearch as string,
                    side: params.side as string,
                    position: params.position as string,
                    extremity: params.extremity as string,
                    logo: params.brand as string,
                    manufacturer: params.reference as string,
                  }"
                  :manufacturer="product.data.manufacturer"
                  :original="product.data.original"
                  :extremity="product.data.extremity"
                  :logo-alt="product.data.logoAlt"
                  :title="product.data.description"
                  :position="product.data.position"
                  :side="product.data.side"
                  :logo="product.data.logo"
                  :image="product.data.picture"
                />

                <ProductCardBody
                  class="order-2 order-md-0"
                  :images="[
                    product.data.picture,
                    product.data.technicalPicture,
                  ]"
                  :code="product.data.id"
                  :similars="product.data.similars"
                  :is-similar="product.data.isSimilar"
                  @on-get-similars="
                    fetchSimilars($event, product.index).then(() => {
                      scrollTo(product.index);
                    })
                  "
                  :loading="product.data.isLoading"
                  :result-ids="products?.results.map(item => item.id)"
                  :similar-index="product.data.similarIndex"
                />

                <ProductCardForm
                  :default-value="
                    Number(
                      order?.itens.find(item => item.id == product.data.id)
                        ?.quantity || '',
                    )
                  "
                  :index="product.index"
                  :id="product.data.id"
                  :manufacturer-code="product.data.manufacturer"
                  :price="product.data.price"
                  :loading="product.data.isBuying"
                />
                <ProductCardDetails
                  :highlight="params.application as string"
                  :details="product.data.application"
                />
              </ProductCardRoot>

              <LoadingRoot v-if="product.data.isLoading" class="mx-auto" />

              <VRow v-if="product.data.noSimilars">
                <VCol>
                  <p class="text-error">
                    {{ t('messages.thisProductHasNoSimilars') }}.
                  </p>
                </VCol>
              </VRow>
            </VCol>
          </VRow>
        </VirtualizationRoot>

        <VRow class="flex-0" style="flex-grow: 0">
          <VCol class="d-flex justify-center">
            <span v-if="products?.end">
              {{ t('messages.allResultsWereShown') }}
            </span>

            <LoadingRoot v-if="isSearchingProduct.pagination && page > 1" />
          </VCol>
        </VRow>
      </main>
    </VCol>

    <DialogRoot @on-change="modal = $event" :is-open="modal">
      <DialogClose @on-close="modal = false" />
      <DialogContent :title="t('messages.sendedOrders')">
        <TableExpandableRoot height="80vh" :loading="isFetchingOrders">
          <template #header>
            <th class="short text-center">{{ t('number') }}</th>
            <th class="text-center">{{ t('date') }}</th>
            <th class="text-center">{{ t('sended') }}</th>
            <th class="short">{{ t('messages.qtdItem') }}</th>
            <th class="short text-center">{{ t('messages.qtdUnit') }}</th>
            <th class="short text-center">{{ t('total') }}</th>
            <th class="short text-center">{{ t('status') }}</th>
            <th class="short text-center">{{ t('invoice') }}</th>
          </template>
          <TableExpandableList
            v-for="order in finishedOrders?.orders"
            :key="order.id"
          >
            <TableExpandableItem class="text-center">{{
              order.id
            }}</TableExpandableItem>
            <TableExpandableItem class="text-center">{{
              format(order.createdAt, 'dd/MM/yyyy HH:mm:ss')
            }}</TableExpandableItem>
            <TableExpandableItem class="text-center">{{
              format(order.sendedAt, 'dd/MM/yyyy HH:mm:ss')
            }}</TableExpandableItem>
            <TableExpandableItem class="text-center"
              >{{ order.totalQuantity }}
            </TableExpandableItem>
            <TableExpandableItem class="text-center"
              >{{ order.quantity }}
            </TableExpandableItem>
            <TableExpandableItem class="text-end">{{
              formatMoney(Number(order.total))
            }}</TableExpandableItem>
            <TableExpandableItem class="text-end">{{
              order.status
            }}</TableExpandableItem>

            <TableExpandableItem class="text-center">{{
              order.document
            }}</TableExpandableItem>

            <template #expandable-content>
              <TableExpandableRoot :loading="false">
                <template #header>
                  <th>Cód</th>
                  <th>Tipo</th>
                  <th>Item</th>
                  <th>Obs</th>
                  <th>Medida</th>
                  <th>Marca</th>
                  <th>QTD</th>
                  <th>V.Unit</th>
                  <th>V.total</th>
                </template>
                <tr v-for="item in order.itens" :key="item.id">
                  <TableExpandableItem>{{ item.id }}</TableExpandableItem>
                  <TableExpandableItem>{{ item.type }}</TableExpandableItem>
                  <TableExpandableItem>{{
                    item.description
                  }}</TableExpandableItem>
                  <TableExpandableItem :clamp="2" :title="item.obs">{{
                    item.obs
                  }}</TableExpandableItem>
                  <TableExpandableItem>{{ item.size }} </TableExpandableItem>
                  <TableExpandableItem>{{ item.brand }}</TableExpandableItem>
                  <TableExpandableItem>{{
                    Number(item.quantity)
                  }}</TableExpandableItem>
                  <TableExpandableItem class="text-end">{{
                    formatMoney(Number(item.price))
                  }}</TableExpandableItem>
                  <TableExpandableItem class="text-end">{{
                    formatMoney(Number(item.total))
                  }}</TableExpandableItem>
                </tr>
              </TableExpandableRoot>
            </template>
          </TableExpandableList>
        </TableExpandableRoot>
      </DialogContent>
    </DialogRoot>
    <FilterModal
      :loading="filterModalData.loading"
      :data="filterModalData?.data"
      @on-close="closeFilter"
      @on-save="
        selectedFilters = $event;
        searchProduct();
        closeFilter();
      "
      :is-open="isFilterOpen"
    >
      <template #prepend>
        <FilterSearch @on-search="onSearch" />
      </template>

      <template #append>
        <DialogRow class="d-flex align-center gap-1">
          <div style="max-width: 80%">
            <PaginationRoot
              @on-page-change="onPageChange"
              v-if="filterModalData?.data?.length"
              :actual="filterModalData.actual"
              :loading="filterModalData.loading"
              :last="filterModalData.last"
            >
              <template #prepend>
                <PaginationInfo
                  :total="filterModalData.total"
                  :from="filterModalData.from || 0"
                  :to="filterModalData.to"
                />
              </template>
            </PaginationRoot>
          </div>
        </DialogRow>
      </template>
    </FilterModal>

    <DrawerRoot
      v-if="!smAndUp"
      @on-change="isDrawerOpen = !isDrawerOpen"
      :open="isDrawerOpen"
      style="width: 90%"
    >
      <div class="d-flex">
        <h1 class="text-center me-auto pl-10">{{ t('filters') }}</h1>
        <VBtn class="mr-10" @click="applyFilters">
          {{ t('apply') }}
        </VBtn>
      </div>

      <FilterRoot :loading="false" @on-filter-change="onFilterChange">
        <FilterBody
          :max-level="2"
          v-if="products?.types.length"
          :data="{ filters: products.types }"
          :active-filters="activeSidebarFilters"
          :loading="isSearchingProduct.filters"
        />
      </FilterRoot>
    </DrawerRoot>

    <DialogRoot
      :is-open="isSendModalOpen"
      @on-change="isSendModalOpen = !isSendModalOpen"
    >
      <DialogClose @on-close="isSendModalOpen = false" />

      <DialogContent title="">
        <SkeletonRoot v-if="isFetchingCreditLimit" :height="44" :width="110" />

        <InfoCardRoot
          v-else-if="!userStore.isAdmin && creditLimit?.limitAvailable"
          :label="t('available')"
          :value="formatMoney(creditLimit?.limitAvailable)"
          class="mb-3 ms-auto mr-3"
          style="
            border: 2px solid rgb(var(--v-theme-success));
            color: rgb(var(--v-theme-success));
            max-width: 110px;
          "
        />
        <TableExpandableRoot class="max-h-46" :loading="false">
          <template #header>
            <th></th>
            <th>Cód</th>
            <th>Tipo</th>
            <th>Item</th>
            <th>Obs</th>
            <th>Medida</th>
            <th>Marca</th>
            <th>QTD</th>
            <th>V.Unit</th>
            <th>V.total</th>
          </template>

          <tr
            v-for="item in order?.itens"
            :key="item.id"
            :class="{
              'text-error': orderFinishError?.itemIds?.includes(item.itemId),
              'text-disabled': isFetchingDeleteOrder,
            }"
          >
            <TableExpandableItem>
              <button @click="deleteOrder(item.itemId)">
                <VIcon icon="tabler-trash-x" color="error" />
              </button>
            </TableExpandableItem>
            <TableExpandableItem>{{ item.id }}</TableExpandableItem>
            <TableExpandableItem>{{ item.type }}</TableExpandableItem>
            <TableExpandableItem>{{ item.itemId }}</TableExpandableItem>
            <TableExpandableItem :clamp="2" :title="item.obs">{{
              item.obs
            }}</TableExpandableItem>
            <TableExpandableItem>{{ item.size }}</TableExpandableItem>
            <TableExpandableItem>{{ item.brand }}</TableExpandableItem>
            <TableExpandableItem>{{
              Number(item.quantity)
            }}</TableExpandableItem>

            <TableExpandableItem class="text-end">{{
              formatMoney(Number(item.price))
            }}</TableExpandableItem>
            <TableExpandableItem class="text-end">{{
              formatMoney(Number(item.total))
            }}</TableExpandableItem>
          </tr>
        </TableExpandableRoot>

        <VForm @submit.prevent class="d-flex flex-column gap-3 mt-3">
          <TableExpandableRoot :loading="false">
            <template #header>
              <th class="short text-center">{{ t('number') }}</th>
              <th class="text-center">{{ t('date') }}</th>
              <th class="short">{{ t('messages.qtdItem') }}</th>
              <th class="short text-center">{{ t('messages.qtdUnit') }}</th>
              <th class="short text-center">{{ t('total') }}</th>
            </template>
            <tr v-if="order">
              <TableExpandableItem>{{ order?.id }}</TableExpandableItem>
              <TableExpandableItem>{{
                format(order.createdAt, 'dd/MM/yyyy HH:mm:ss')
              }}</TableExpandableItem>
              <TableExpandableItem>{{
                order?.quantity || order?.quantity
              }}</TableExpandableItem>
              <TableExpandableItem>{{
                order?.totalQuantity || order?.totalQuantity
              }}</TableExpandableItem>
              <TableExpandableItem class="text-end">{{
                formatMoney(Number(order?.total || order?.total))
              }}</TableExpandableItem>
            </tr>
          </TableExpandableRoot>

          <SkeletonRoot
            v-if="isFetchingCarriers || isFetchingPaymentForm"
            :height="125"
          />

          <VCard v-else class="py-2 px-3" style="overflow: visible">
            <RowRoot class="d-flex gap-3">
              <VCol>
                <VSelect
                  @update:model-value="handleDueDate($event)"
                  v-model="paymentValue"
                  density="comfortable"
                  :items="paymentForms"
                  :label="t('messages.paymentForm')"
                  item-title="label"
                  item-value="id"
                />
              </VCol>
              <VCol>
                <SkeletonRoot v-if="isFetchingDueDate" :height="48" />
                <VSelect
                  :disabled="!dueDateLabels.length"
                  v-else
                  v-model="dueDateValue"
                  @update:model-value="updateOrder({ cdVencimento: $event })"
                  density="comfortable"
                  :items="dueDate"
                  item-title="label"
                  item-value="id"
                  :label="t('dueDate')"
                  hide-no-data
                />
              </VCol>
              <VCol cols="auto" class="d-flex justify-center align-center">
                <VChip variant="elevated"> NFE </VChip>
              </VCol>
            </RowRoot>
            <RowRoot class="mt-3 d-flex gap-3 align-center">
              <VCol cols="4">
                <VSelect
                  :disabled="pickupAtCounter"
                  v-model="carrierValue"
                  @update:model-value="
                    console.log($event);
                    updateOrder({ cdTransportadora: Number($event) });
                  "
                  density="comfortable"
                  :items="carriers"
                  item-title="label"
                  item-value="id"
                  :label="t('carrier')"
                />
              </VCol>

              <VCol>
                <VCheckbox
                  @update:model-value="updateOrder({ flRetira: $event })"
                  v-model="pickupAtCounter"
                  :label="t('messages.pickUpAtTheCounter')"
                />
              </VCol>
            </RowRoot>
          </VCard>

          <RowRoot class="d-flex flex-wrap justify-center gap-3">
            <VCol cols="auto">
              <VBtn
                @click="
                  finishOrder().then(() => {
                    if (orderFinishStatusCode == 200) {
                      isSendModalOpen = false;
                    }
                  })
                "
                color="success"
                >{{ t('messages.sendOrder') }}</VBtn
              >

              <p class="text-error mt-3">
                {{ orderFinishError?.message }}
              </p>
            </VCol>
            <VCol cols="auto">
              <VBtn
                color="error"
                variant="outlined"
                @click="isSendModalOpen = false"
                >{{ t('back') }}</VBtn
              >
            </VCol>
          </RowRoot>
        </VForm>
      </DialogContent>
    </DialogRoot>
  </VRow>
</template>

<style lang="scss">
  @use '@core/scss/template/libs/apex-chart.scss';
</style>

<style scoped lang="scss">
  .filter-wrapper {
    padding-top: 0;
    transition: 0.3s ease-in-out;
  }
  .list {
    cursor: pointer;
  }
  .short {
    width: 1%;
    white-space: nowrap;
  }

  .search-activator-open {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    translate: -50% -50%;
  }

  .filter-activator-mobile {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    translate: -0% -70%;
    background-color: rgb(var(--v-theme-primary));
    border-radius: 50%;
    padding: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .filled-fields-wrapper :deep(div) {
    border: 1px solid rgb(var(--v-theme-primary));
    border-top: none;
    gap: 0.25rem;
    padding: 0.25rem;
  }
  .filled-fields-wrapper :deep(div:nth-of-type(even)) {
    border-left: none;
  }
</style>
