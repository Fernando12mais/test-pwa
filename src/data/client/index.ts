import { TableExpandableOrgProps } from '@/components/organisms/tableExpandableOrgTypes';
import i18n from '@/plugins/i18n';
import { ProcessedOrdersFinishedResponse } from '@/services/ordersFinished/types';
import { formatMoney } from '@/utils/formatters';
import { format } from 'date-fns';

const { t } = i18n.global;

type GenerateOrderBody<T extends string> = (
  order: ProcessedOrdersFinishedResponse['orders']['0'] | null,
) => TableExpandableOrgProps<T>['body'];

type GenerateOrdersBody<T extends string> = (
  order: ProcessedOrdersFinishedResponse['orders'] | null,
) => TableExpandableOrgProps<T>['body'];

type OrderActions = 'open:sendedOrders' | 'send:orders';

export const headerOrders: TableExpandableOrgProps<OrderActions>['headers'] = [
  { label: t('number'), short: true },
  { label: t('date') },
  { label: t('messages.qtdItem'), short: true },
  { label: t('messages.qtdUnit'), short: true },
  { label: t('total'), short: true },
];
export const headerOrdersAction: TableExpandableOrgProps<OrderActions>['headerActions'] =
  [
    {
      action: 'open:sendedOrders',
      icon: 'tabler-file-check',
      label: t('messages.sendedOrders'),
      short: true,
    },
  ];

export const headerOrdersLength =
  headerOrders.length + headerOrdersAction.length;

export const bodyOrdersAction: TableExpandableOrgProps<OrderActions>['bodyActions'] =
  [{ action: 'send:orders', icon: '', label: t('send') }];
const expandableOrdersHeader: TableExpandableOrgProps<OrderActions>['headers'] =
  [
    { label: 'Cód', short: true },
    { label: 'Tipo', short: true },
    { label: 'Item', short: true },
    { label: 'Obs', short: true },

    { label: 'Medida', short: true },

    { label: 'Marca', short: true },
    { label: 'QTD', short: true },

    { label: 'V.unit', short: true },
    { label: 'V.Total', short: true },
  ];

export const getBodyOrders: GenerateOrderBody<OrderActions> = order => {
  if (!order) return { data: [] };
  return {
    data: [
      {
        cols: [
          { label: order.id },
          { label: format(order.createdAt, 'dd/MM/yyyy HH:mm:ss') },
          { label: order.quantity, class: 'highlight-text' },
          { label: order.totalQuantity, class: 'highlight-text' },
          {
            label: formatMoney(Number(order.total)),
            class: 'text-end highlight-text',
          },
        ],
      },
    ],

    expandable: {
      loading: false,
      headers: expandableOrdersHeader,

      body: {
        data: order.itens.map(item => ({
          cols: [
            { label: item.id },
            { label: item.type },
            { label: item.itemId },
            { label: item.obs },
            { label: item.size },
            { label: item.brand },
            { label: item.quantity },
            {
              label: formatMoney(Number(item.price)),
              class: 'text-end ',
            },
            { label: formatMoney(Number(item.total)), class: 'text-end' },
          ],
        })),
      },
    },
  };
};

export const headerSendedOrders: TableExpandableOrgProps<string>['headers'] = [
  { label: t('number') },
  { label: t('date') },
  { label: t('sended') },
  { label: t('messages.qtdItem') },
  { label: t('messages.qtdUnit') },
  { label: t('total') },
  { label: t('status') },
  { label: t('invoice') },
];

export const getSendedOrdersBody: GenerateOrdersBody<string> = orders => {
  if (!orders?.length) return { data: [] };

  return {
    data: orders.map(order => ({
      cols: [
        { label: order.id },
        { label: format(order.createdAt, 'dd/MM/yyyy HH:mm:ss') },
        { label: format(order.sendedAt, 'dd/MM/yyyy HH:mm:ss') },
        { label: order.totalQuantity },
        { label: order.quantity },
        { label: formatMoney(Number(order.total)) },
        { label: order.status },
        { label: order.document },
      ],
    })),
    expandable: {
      headers: expandableOrdersHeader,
      loading: false,
      body: {
        data: [],
      },
    },
  };
};

export const headerSendedOrdersLength = expandableOrdersHeader.length;
