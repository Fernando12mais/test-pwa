import { formatMoney } from '@/utils/formatters';
import { useFetchAPI } from '../api';
import { PromotionsB2BProcessedResponse, PromotionsB2BResponse } from './types';
const { post, data, error, isFetching } =
  useFetchAPI<PromotionsB2BProcessedResponse>('promocaoB2B', {
    immediate: false,
    afterFetch: ctx => {
      const data = ctx.data as PromotionsB2BResponse;

      const processedData: PromotionsB2BProcessedResponse = data.map(item => ({
        id: item.cdItem,
        type: item.dsTipo,
        description: item.dsSubDescricao,
        brand: item.dsMarca,
        oldCode: item.dsCodigoAntigo,
        manufacturer: item.dsCodigoFabricante,
        promotion: item.vlPrecoPromocao,
        sell: item.vlPrecoVenda,
      }));

      ctx.data = processedData;

      return ctx;
    },
  });

export const promotionsService = { post, data, error, isFetching };
