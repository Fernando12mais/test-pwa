import { FilterOption } from '@/stores/useFilterStore/types';
import { useFetchAPI } from '../api';
import { FilterSubdescriptionResponse } from './types';

export const filterSubDescriptionsService = () => {
  const { post, data, isFetching, error } = useFetchAPI<
    FilterOption[] | undefined
  >('item/subDescricao/filtros', {
    immediate: false,
    afterFetch: ctx => {
      const data = ctx.data as FilterSubdescriptionResponse;

      const processedData: FilterOption[] | undefined = data.map(item => ({
        title: item.dsSubDescricao,
      }));

      ctx.data = processedData;
      return ctx;
    },
  });
  return { post, data, isFetching, error };
};
