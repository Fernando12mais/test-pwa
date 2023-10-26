import { FilterOption } from '../useFilterStore/types';

export function getFilterByTitle(
  titleOrId: string | number,
  filters: FilterOption[],
  acc: FilterOption | undefined = undefined,
) {
  const findedFilter = filters.find(
    filter =>
      filter.title == titleOrId ||
      filter.value == titleOrId ||
      filter.id == titleOrId,
  );

  if (findedFilter) {
    if (!findedFilter.level)
      findedFilter.level = findedFilter.father
        ? (findedFilter.father?.level || 0) + 1
        : 0;
    return findedFilter;
  }

  filters.forEach(filter => {
    if (filter.subgroup?.length) {
      const findedFilter = getFilterByTitle(titleOrId, filter.subgroup, acc);
      if (findedFilter) {
        acc = findedFilter;
      }
    }
  });

  return acc;
}

export function getNestedTitles(
  filter: FilterOption,
  activeFilters: string[],
  acc: string[] = [],
) {
  if (isFilterSelected(filter.id, activeFilters)) acc.push(filter.id);

  if (filter.subgroup?.length) {
    filter.subgroup.forEach(item => getNestedTitles(item, activeFilters, acc));
  }

  return acc;
}

function isFilterSelected(filter: string, target: string[]) {
  return target.includes(filter);
}
