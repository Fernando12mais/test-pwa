import { useFetchPublicAPI } from '../api';

const { get, isFetching, execute, data, statusCode } = useFetchPublicAPI(
  `b2b/${import.meta.env.VITE_B2B_CNPJ_EMPRESA}/configuracao`,
);
export const configService = { get, isFetching, execute, data, statusCode };
