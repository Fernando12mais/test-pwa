import { useToastStore } from '@/stores/useToastStore';
import { useFetchAPI } from '../api';
import {
  OrdersFinishedResponse,
  ProcessedOrdersFinishedResponse,
} from '../ordersFinished/types';
import { OrderCreatePayload } from './types';
import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';

export const orderCreateService = () => {
  const { toast } = useToastStore();
  const { t } = useI18n<GlobalLocaleSchema>();
  const {
    data: newOrder,
    post,
    isFetching: isCreatingOrder,
    isFinished: isNewOrderCreated,
  } = useFetchAPI<ProcessedOrdersFinishedResponse['orders'][0]>('pedidoItem', {
    afterFetch: ctx => {
      const data = ctx.data as OrdersFinishedResponse['pedidos'][0];

      const processedData: ProcessedOrdersFinishedResponse['orders']['0'] = {
        id: data.cdPedido,
        createdAt: new Date(data.dtRegistro),
        sendedAt: new Date(data.dtEncerramentoB2b),
        document: data.dsNumeroDocumento,
        quantity: data.nrItem,
        totalQuantity: data.nrQtdItem,
        total: data.vlTotal,
        status: data.dsStatus,
        itens: data.itens.map(item => ({
          brand: item.dsMarca,
          description: item.dsSubDescricao,
          id: item.cdItem,
          itemId: item.cdPedidoItem,
          obs: item.txObs,
          orderId: item.cdPedido,
          price: item.vlUnitario,
          quantity: item.nrQuantidade,
          size: item.dsMedida,
          total: item.vlTotalItem,
          type: item.dsTipo,
        })),
      };

      ctx.data = processedData;

      return ctx;
    },
  });

  async function createOrder(
    payload: OrderCreatePayload,
    successToast?: boolean,
  ) {
    await post(payload)
      ?.json()
      .execute(true)
      .then(() => {
        if (successToast) {
          toast({ message: t('messages.itemAddedToOrderSuccessfully') });
        }
      });
  }

  return { newOrder, createOrder, isCreatingOrder, isNewOrderCreated };
};
