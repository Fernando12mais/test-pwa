import { Order, ProcessedOrder } from '../ordersFinished/types';

export const ProcessOrder = (order: Order): ProcessedOrder => {
  return {
    id: order.cdPedido,
    createdAt: new Date(order.dtRegistro),
    sendedAt: new Date(order.dtEncerramentoB2b),
    document: order.dsNumeroDocumento,
    quantity: order.nrItem,
    totalQuantity: order.nrQtdItem,
    total: order.vlTotal,
    status: order.dsStatus,
    carrierId: order.cdTransportadora,
    dueDateId: order.cdVencimento,
    paymentFormId: order.cdFormaPagamento,
    getOnSite: order.flRetira,
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
  };
};
