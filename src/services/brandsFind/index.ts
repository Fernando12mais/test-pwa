import { useFetchAPI } from '../api';
const { post } = useFetchAPI('marca/find', { immediate: false });
export const brandsFindService = { post };
