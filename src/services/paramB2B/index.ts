import { useFetchAPI } from '../api';

export const paramB2BService = () => {
  const { post, isFetching, data } = useFetchAPI('parametroB2B');

  return { post, isFetching, data };
};
