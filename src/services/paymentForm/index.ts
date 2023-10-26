import { useFetchAPI } from '../api';
import { PaymentFormResponse, ProcessedPaymentFormResponse } from './types';
export const paymentFormService = () => {
  const {
    get,
    isFetching: isFetchingPaymentForm,
    data: paymentForms,
  } = useFetchAPI<ProcessedPaymentFormResponse>('formaPagamento', {
    afterFetch: ctx => {
      const data = ctx.data as PaymentFormResponse;

      const processedData: ProcessedPaymentFormResponse = data.map(item => ({
        id: item.cdFormaPagamento,
        label: item.dsFormaPagamento,
      }));
      ctx.data = processedData;
      return ctx;
    },
  });

  const getPaymentForms = async () => {
    await get()
      ?.json()
      .execute(true)
      .then(() => {
        console.log(paymentForms.value);
      })
      .catch(err => console.error(err));
  };

  return { getPaymentForms, isFetchingPaymentForm, paymentForms };
};
