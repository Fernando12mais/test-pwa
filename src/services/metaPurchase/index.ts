import { LoginResponse } from '../login/types';
import { useFetchAPI } from '../api';

const metaPurchaseService = (cdPessoa: LoginResponse['user']['cdPessoa']) => {
  const { get } = useFetchAPI(`metaCompra/${cdPessoa}`, { immediate: false });

  return { get };
};

export { metaPurchaseService };
