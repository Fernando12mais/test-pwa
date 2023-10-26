export type OrderFinishResponse = {
  error?: 'LIMIT_INSUFICIENT' | 'STOCK_INSUFICIENT';
  cdPedidoItem?: number[];
};

export type ProcessedOrderFinishResponse = {
  error?: OrderFinishResponse['error'];
  itemIds?: OrderFinishResponse['cdPedidoItem'];
  message?: string;
};
