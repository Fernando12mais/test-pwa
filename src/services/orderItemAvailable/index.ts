import { useFetchAPI } from '../api';
import { OrderItemServiceResponse, OrderItemServiceParams } from './types';

export const orderItemAvailableService = () => {
  const { post, isFetching, data, error } =
    useFetchAPI<OrderItemServiceResponse>('pedidoItem/disponivel');

  async function verifyAvailability(payload: OrderItemServiceParams) {
    await post(payload).json().execute(true);
  }

  return { post, isFetching, data, error, verifyAvailability };
};
