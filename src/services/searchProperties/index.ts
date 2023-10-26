import { useFetchAPI } from '../api';
import {
  SearchPropertiesResponse,
  ProcessedSearchPropertiesResponse,
} from './types';

export const searchPropertiesService = () => {
  const {
    data: searchProperties,
    isFetching: isFetchingProperties,
    get,
  } = useFetchAPI<ProcessedSearchPropertiesResponse>('item/propriedades/pt', {
    afterFetch: ctx => {
      const data = ctx.data as SearchPropertiesResponse;

      const side = Object.values(data.lado);
      const position = Object.values(data.posicao);
      const extremity = Object.values(data.extremidade);

      const processedData: ProcessedSearchPropertiesResponse = {
        side,
        position,
        extremity,
      };

      ctx.data = processedData;
      return ctx;
    },
  });

  const getProperties = async () => {
    await get()?.json().execute(true);
  };

  return { searchProperties, isFetchingProperties, getProperties };
};
