import { FilterOption } from '@/stores/useFilterStore/types';
import { useFetchAPI } from '../api';
import { FilterBrandsResponse } from './types';
const { post } = useFetchAPI('item/marca/filtros', { immediate: false });
export const filterBrandsService = { post };

export const filterBrandsServiceRefactor = () => {
  const { post, data, error, isFetching } = useFetchAPI<
    FilterOption[] | undefined
  >('item/marca/filtros', {
    immediate: false,
    afterFetch: ctx => {
      const data = ctx.data as FilterBrandsResponse;

      const processedData: FilterOption[] | undefined = data?.map(item => ({
        title: item.dsMarca,
        value: item.cdMarca,
      }));
      ctx.data = processedData;

      return ctx;
    },
  });

  return { post, data, error, isFetching };
};
