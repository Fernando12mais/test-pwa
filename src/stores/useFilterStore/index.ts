import { defineStore } from 'pinia';
import { FilterOption } from './types';

import { fetchBrandsFind } from './fetch';

import {
  BrandsFindPayload,
  ProcessedBrandsFind,
} from '@/services/brandsFind/types';

export type ModalActiveFilter = Pick<FilterOption, 'title' | 'value'>;

export const useFilterStore = defineStore('FilterStore', () => {
  const data = ref<ProcessedBrandsFind>({ actual: 1, loading: false });

  const selectedFilters = ref<ModalActiveFilter[]>([]);

  const isFilterOpen = ref(false);

  const defaultFindParams = ref<BrandsFindPayload>({
    limit: 50,
    pageNumber: 1,
    orderBy: { dsMarca: 'ASC' },
    fields: ['cdMarca', 'dsMarca'],
    conditions: {
      equalsTo: {
        flExibirB2b: true,
      },
      differentTo: {
        dsMarca: '',
      },
    },
  });

  function reset() {
    selectedFilters.value = [];
  }

  const filterModalData = computed(() => {
    return {
      ...data.value?.[data.value.actual],
      loading: data.value.loading,
    };
  });

  function onPageChange(number: number) {
    defaultFindParams.value.pageNumber = number;
    if (!data.value?.[number]?.data)
      return searchBrands(defaultFindParams.value);
    data.value.actual = number;
  }

  function onSearch(value: string) {
    defaultFindParams.value.pageNumber = 1;
    defaultFindParams.value.conditions = {
      ...defaultFindParams.value.conditions,
      startsWith: {
        dsMarca: value?.toUpperCase(),
      },
    };
    searchBrands(defaultFindParams.value);
  }

  function selectUnselectFilter(filter: ModalActiveFilter) {
    if (selectedFilters.value.some(item => item.value == filter.value)) {
      selectedFilters.value = selectedFilters.value.filter(
        item => item.value !== filter.value,
      );

      return;
    }

    selectedFilters.value.push(filter);
  }

  function openFilter() {
    isFilterOpen.value = true;
  }

  function closeFilter() {
    isFilterOpen.value = false;
  }

  async function searchBrands(payload: BrandsFindPayload) {
    data.value.loading = true;
    const { processedResponse, request } = await fetchBrandsFind(payload);

    data.value = {
      ...data.value,
      ...processedResponse,
    };

    return { request };
  }

  function isFilterSelected(id: string) {
    return selectedFilters.value.some(item => item.value == Number(id));
  }

  return {
    isFilterSelected,
    searchBrands,
    isFilterOpen,
    openFilter,
    closeFilter,
    filterModalData,
    selectUnselectFilter,
    defaultFindParams,
    onPageChange,
    onSearch,
    reset,
    selectedFilters,
    data,
  };
});
