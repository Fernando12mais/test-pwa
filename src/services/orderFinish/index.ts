import { useToastStore } from '@/stores/useToastStore';
import { useFetchAPI } from '../api';
import { OrderFinishResponse, ProcessedOrderFinishResponse } from './types';

export const orderFinishService = () => {
  const {
    isFetching: isFetchingOrderFinish,
    error: orderFinishError,
    get,
    statusCode: orderFinishStatusCode,
  } = useFetchAPI('pedido/b2b/finish', {
    onFetchError: ctx => {
      const error = ctx.data as OrderFinishResponse;
      const processedError: ProcessedOrderFinishResponse = {
        error: error.error,
        itemIds: error.cdPedidoItem,
      };

      ctx.error = processedError;
      if (processedError.error == 'LIMIT_INSUFICIENT') {
        ctx.error.message = 'Limite insuficiente';
      }
      if (processedError.error == 'STOCK_INSUFICIENT') {
        ctx.error.message = `Erro! Itens em falta no estoque`;
      }

      return ctx;
    },
  });
  const { toast } = useToastStore();

  const finishOrder = async () => {
    await get()
      ?.json()
      .execute(true)
      .then(() => {
        toast({ message: 'Pedido enviado com sucesso!', color: 'success' });
      })
      .catch(err => console.error(err));
  };

  return {
    finishOrder,
    isFetchingOrderFinish,
    orderFinishError: orderFinishError as ProcessedOrderFinishResponse,
    orderFinishStatusCode,
  };
};
