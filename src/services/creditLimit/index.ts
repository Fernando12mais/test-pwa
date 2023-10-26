import { useFetchAPI } from '../api';
import { ProcessedCreditLimitResponse, CreditLimitResponse } from './types';

export const creditLimitService = () => {
  const {
    data: creditLimit,
    get,
    isFetching: isFetchingCreditLimit,
  } = useFetchAPI<ProcessedCreditLimitResponse>('pessoa/limiteCredito', {
    afterFetch: ctx => {
      const data = ctx.data as CreditLimitResponse;

      const processedResponse: ProcessedCreditLimitResponse = {
        limitAvailable: data.vlLimiteDisponivel,
      };
      ctx.data = processedResponse;

      return ctx;
    },
  });

  async function getCreditLimit() {
    get()
      ?.json()
      .execute(true)
      .then(() => console.log(creditLimit.value))
      .catch(err => console.error(err));
  }

  return { creditLimit, getCreditLimit, isFetchingCreditLimit };
};
