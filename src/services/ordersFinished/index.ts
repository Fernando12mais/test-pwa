import { useFetchAPI } from '../api';
import {
  OrdersFinishedResponse,
  ProcessedOrdersFinishedResponse,
} from './types';

export const ordersFinishedService = () => {
  const { data, isFetching, error, get } =
    useFetchAPI<ProcessedOrdersFinishedResponse>('pedido/finish', {
      afterFetch: ctx => {
        const data = ctx.data as OrdersFinishedResponse;

        const processedData: ProcessedOrdersFinishedResponse = {
          orders: data.pedidos.map(order => ({
            id: order.cdPedido,
            createdAt: new Date(order.dtRegistro),
            sendedAt: new Date(order.dtEncerramentoB2b),
            document: order.dsNumeroDocumento,
            quantity: order.nrItem,
            totalQuantity: order.nrQtdItem,
            total: order.vlTotal,
            status: order.dsStatus,
            itens: order.itens.map(item => ({
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
          })),
        };

        ctx.data = processedData;

        return ctx;
      },
    });

  return { data, isFetching, error, get };
};
