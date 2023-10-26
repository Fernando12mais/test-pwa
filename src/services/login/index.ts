import { useFetchPublicAPI } from '../api';
import { LoginSubject } from './types';

const loginService = (subject: LoginSubject) => {
  const { post } = useFetchPublicAPI(
    subject == 'admin' ? 'usuario/admin/login' : 'usuario/login',
    {
      immediate: false,
      timeout: 20000,
    },
  );

  return { post };
};

export { loginService };
