export type OrderFinishResponse = {
  error?:
    | 'LIMIT_INSUFICIENT'
    | 'STOCK_INSUFICIENT'
    | 'GENERIC_ERROR'
    | 'PROMOTION_EXPIRED';
  cdPedidoItem?: number[];
};

export type ProcessedOrderFinishResponse = {
  error?: OrderFinishResponse['error'];
  itemIds?: OrderFinishResponse['cdPedidoItem'];
  message?: string;
};
