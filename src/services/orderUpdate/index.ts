import { useFetchAPI } from '../api';
import { OrderUpdatePayload } from './types';

export const orderUpdateService = () => {
  const { post } = useFetchAPI('pedido/b2b');

  const updateOrder = async (payload: OrderUpdatePayload) => {
    await post(payload)?.json().execute(true);
  };

  return { updateOrder };
};
