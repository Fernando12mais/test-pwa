import { FilterOption } from '@/stores/useFilterStore/types';
import { useFetchAPI } from '../api';
import { FilterTypesResponse } from './types';

export const filterTypesService = () => {
  const { post, data, error, isFetching } = useFetchAPI<
    FilterOption[] | undefined
  >('item/tipo/filtros', {
    immediate: false,
    afterFetch: ctx => {
      const data = ctx.data as FilterTypesResponse;

      const processedResponse: FilterOption[] | undefined = data?.map(item => ({
        title: item.dsTipo,
        value: item.cdTipo,
        level: 0,
      }));
      ctx.data = processedResponse;
      return ctx;
    },
  });

  return { post, data, error, isFetching };
};
