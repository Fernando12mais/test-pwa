import { useFetchAPI } from '../api';
import { ProcessOrder } from '../orderOpen/utils';
import { ProcessedOrder } from '../ordersFinished/types';

export const orderDeleteService = () => {
  const orderAfterDelete = ref<ProcessedOrder | null>(null);
  const isFetchingDeleteOrder = ref(false);
  const isOrderDeleted = ref(false);

  const deleteOrder = async (id: number) => {
    const { data, delete: deleteReq } = useFetchAPI<ProcessedOrder>(
      `pedidoItem/${id}`,

      {
        beforeFetch: ctx => {
          isFetchingDeleteOrder.value = true;
          return ctx;
        },
        onFetchError: ctx => {
          isFetchingDeleteOrder.value = false;
          return ctx;
        },

        afterFetch: ctx => {
          ctx.data = ProcessOrder(ctx.data);
          isOrderDeleted.value = true;
          isFetchingDeleteOrder.value = false;
          return ctx;
        },
      },
    );

    await deleteReq()
      ?.json()
      .execute(true)
      .then(() => (orderAfterDelete.value = data.value));
  };

  return {
    orderAfterDelete,
    isFetchingDeleteOrder,
    deleteOrder,
    isOrderDeleted,
  };
};
