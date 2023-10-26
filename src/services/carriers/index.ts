import { useFetchAPI } from '../api';
import { CarriersResponse, ProcessedCarrirerResponse } from './types';

export const carriersService = () => {
  const {
    get,
    isFetching: isFetchingCarriers,
    data: carriers,
  } = useFetchAPI<ProcessedCarrirerResponse>('transportadora', {
    afterFetch: ctx => {
      const data = ctx.data as CarriersResponse;

      const processedData: ProcessedCarrirerResponse = data.map(item => ({
        id: item.cdPessoa,
        label: item.dsRazaoSocialNome,
      }));
      ctx.data = processedData;
      return ctx;
    },
  });

  const getCarriers = async () => {
    await get()
      ?.json()
      .execute(true)
      .then(() => {
        console.log(carriers.value);
      })
      .catch(err => console.error(err));
  };

  return { getCarriers, isFetchingCarriers, carriers };
};
