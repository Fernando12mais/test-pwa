import mock from '@/@fake-db/mock';

import { FilterData } from './types.filter';

const database: FilterData = {
  filters: [
    {
      title: 'Filtros por marca',
      icon: 'tabler-filter',
      expandable: true,
      value: 0,
    },
  ],
};

mock.onGet('/api/filters').reply(200, database);
