import { useFetchAPI } from '../api';

export const logoutService = () => {
  const { get } = useFetchAPI('usuario/logout', { immediate: false });

  return { get };
};
