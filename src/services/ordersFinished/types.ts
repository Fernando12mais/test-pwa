type Item = {
  cdPedidoItem: number;
  cdPedido: number;
  cdItem: number;
  dsTipo: string;
  dsSubDescricao: string;
  txObs: string;
  dsMedida: string;
  dsMarca: string;
  nrQuantidade: string;
  vlUnitario: string;
  vlTotalItem: string;
};

export type Order = {
  cdPedido: number;
  dtRegistro: Date;
  dtEncerramentoB2b: Date;
  dsStatus: string;
  dsNumeroDocumento: string;
  vlTotal: string;
  cdTransportadora: number;
  cdFormaPagamento: number;
  cdVencimento: number;
  cdSerieFiscal: number;
  dsSerieFiscal: string;
  txObs: null;
  flRetira: boolean;
  nrItem: number;
  nrQtdItem: number;
  itens: Item[];
};

export type ProcessedOrder = {
  id: Order['cdPedido'];
  createdAt: Order['dtRegistro'];
  sendedAt: Order['dtEncerramentoB2b'];
  status: Order['dsStatus'];
  document: Order['dsNumeroDocumento'];
  total: Order['vlTotal'];
  totalQuantity: Order['nrQtdItem'];
  quantity: Order['nrItem'];
  paymentFormId: Order['cdFormaPagamento'];
  carrierId: Order['cdTransportadora'];
  dueDateId: Order['cdVencimento'];
  getOnSite?: Order['flRetira'];

  itens: ProcessedOrderItem[];
};

export type OrdersFinishedResponse = {
  pedidos: Order[];
};

export type ProcessedOrdersFinishedResponse = {
  orders: ProcessedOrder[];
};

export type ProcessedOrderItem = {
  id: Item['cdItem'];
  orderId: Item['cdPedido'];
  itemId: Item['cdPedidoItem'];
  type: Item['dsTipo'];
  brand: Item['dsMarca'];
  size: Item['dsMedida'];
  description: Item['dsSubDescricao'];
  obs: Item['txObs'];
  quantity: Item['nrQuantidade'];
  price: Item['vlUnitario'];
  total: Item['vlTotalItem'];
  loading?: boolean;
};
