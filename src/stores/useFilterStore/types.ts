export type FilterOption = {
  title: string;
  icon?: string;
  subgroup?: FilterOption[];
  loading?: boolean;
  value?: number;
  level?: number;
  father?: FilterOption;
  id: string;
};

export type FilterData = {
  title?: string;
  filters: FilterOption[];
  loading?: boolean;
};
