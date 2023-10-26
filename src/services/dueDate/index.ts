import { useFetchAPI } from '../api';
import { PaymentFormResponse } from '../paymentForm/types';

import { DueDateResponse, ProcesseDueDateResponse } from './types';

export const dueDateService = () => {
  const dueDate = ref<ProcesseDueDateResponse>([]);
  const isFetchingDueDate = ref(false);
  const getDueDate = async (
    paymentFormId: PaymentFormResponse['0']['cdFormaPagamento'],
  ) => {
    const { get } = useFetchAPI(`vencimento/${paymentFormId}`, {
      refetch: true,

      beforeFetch: ctx => {
        isFetchingDueDate.value = true;
        return ctx;
      },
      onFetchError: ctx => {
        isFetchingDueDate.value = false;
        return ctx;
      },
      afterFetch: ctx => {
        const data = ctx.data as DueDateResponse;
        isFetchingDueDate.value = false;
        dueDate.value = data.map(item => ({
          id: item.cdPessoa,
          label: item.dsRazaoSocialNome,
        }));
        //   const data = ctx.data as CarriersResponse;

        //   const processedData: ProcessedCarrirerResponse = data.map(item => ({
        //     id: item.cdPessoa,
        //     label: item.dsRazaoSocialNome,
        //   }));
        //   ctx.data = processedData;
        return ctx;
      },
    });
    await get()
      ?.json()
      .execute(true)
      .then(() => {
        console.log(dueDate.value);
      })
      .catch(err => console.error(err));
  };

  return { getDueDate, isFetchingDueDate, dueDate };
};
