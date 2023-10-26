import { useToastStore } from '@/stores/useToastStore';
import { useFetchAPI } from '../api';
import { OrderFinishResponse, ProcessedOrderFinishResponse } from './types';
import { useUserStore } from '@/stores/useUserStore';

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

      const errorCases: Record<
        Exclude<ProcessedOrderFinishResponse['error'], undefined>,
        () => void
      > = {
        GENERIC_ERROR: () => {
          ctx.error.message = 'messages.errorWhenFinishingOrder';
        },
        LIMIT_INSUFICIENT: () => {
          ctx.error.message = 'messages.insufficientLimit';
        },
        STOCK_INSUFICIENT: () => {
          ctx.error.message = `messages.errorMissingItemsInStock`;
        },
        PROMOTION_EXPIRED: () => {
          ctx.error.message = 'messages.errorPromotionExpired';
        },
      };

      if (processedError.error) errorCases[processedError.error]();

      return ctx;
    },
  });
  const { toast } = useToastStore();
  const { getCreditLimit } = useUserStore();

  const finishOrder = async () => {
    await get()
      ?.json()
      .execute(true)
      .then(() => {
        getCreditLimit();
        toast({ message: 'Pedido enviado com sucesso!', color: 'success' });
      })
      .catch(err => {
        console.error(err);
      });
  };

  return {
    finishOrder,
    isFetchingOrderFinish,
    orderFinishError: orderFinishError as ProcessedOrderFinishResponse,
    orderFinishStatusCode,
  };
};
