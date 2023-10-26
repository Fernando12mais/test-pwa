import { TableExpandableRootProps } from '../molecules/tableExpandable/tableExpandableTypes';

type Header = {
  label: string | number;
  short?: boolean;
  class?: string;
};

type Action<T extends string> = {
  icon: string;
  label: string;
  action: T;
};

type Body<T extends string> = {
  expandable?: Expandable<T>;

  data: ({
    cols: Header[];
  } & Pick<Header, 'class'>)[];
};

type Expandable<T extends string> = {
  headers: Header[];
  body: Body<T>;
  headerActions?: (Action<T> & Pick<Header, 'short'>)[];
  bodyActions?: Action<T>[];
} & TableExpandableRootProps;

export type TableExpandableOrgProps<T extends string> = Expandable<T> &
  TableExpandableRootProps;
