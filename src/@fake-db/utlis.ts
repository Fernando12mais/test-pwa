export const paginateArray = <T extends unknown[]>(
  array: T,
  perPage: number,
  page: number,
): T => array.slice((page - 1) * perPage, page * perPage) as T
