import { Order } from '../ordersFinished/types';

export type OrderUpdatePayload = Partial<
  Pick<
    Order,
    'cdTransportadora' | 'cdVencimento' | 'cdFormaPagamento' | 'flRetira'
  >
>;
