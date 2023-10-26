import { useFetchAPI } from '../api';
import {
  OrdersFinishedResponse,
  ProcessedOrder,
} from '../ordersFinished/types';
import { ProcessOrder } from './utils';

export const orderOpenService = () => {
  const {
    get,
    data: openOrder,
    isFetching: isFetchingOpenOrder,
  } = useFetchAPI<ProcessedOrder>('pedido/b2b', {
    afterFetch: ctx => {
      ctx.data = ProcessOrder(ctx.data);

      return ctx;
    },
  });

  const getOpenOrder = async () => {
    await get()
      ?.json()
      .execute(true)
      .catch(err => {
        console.error(err);
      });
  };
  return { getOpenOrder, openOrder, isFetchingOpenOrder };
};
