import { defineStore } from 'pinia';
import { productsSearchService } from '@/services/productsSearch';
import { ProductsSearchPayload } from '@/services/productsSearch/types';
import { ordersFinishedService } from '@/services/ordersFinished';
import { FilterOption } from '../useFilterStore/types';
import { getNestedTitles, getFilterByTitle } from './utils';
import { orderOpenService } from '@/services/orderOpen';
import { orderCreateService } from '@/services/orderCreate';
import { paymentFormService } from '@services/paymentForm';
import { carriersService } from '@/services/carriers';
import { dueDateService } from '@/services/dueDate';
import { searchPropertiesService } from '@/services/searchProperties';
import { vehiclePlateService } from '@/services/vehiclePlate';
import { Order, ProcessedOrder } from '@/services/ordersFinished/types';
import { OrderCreatePayload } from '@/services/orderCreate/types';
import { orderDeleteService } from '@/services/orderDelete';
import { orderFinishService } from '@/services/orderFinish';
import { orderUpdateService } from '@/services/orderUpdate';
import { OrderUpdatePayload } from '@/services/orderUpdate/types';

type ActiveFilters = Pick<
  FilterOption,
  'father' | 'title' | 'level' | 'value' | 'subgroup' | 'id'
>[];

type FieldsToReset = 'products' | 'filters' | 'all' | 'page';
export const useProductsStore = defineStore('ProductStore', () => {
  const activeFilters = ref<ActiveFilters>([]);
  const page = ref(1);
  const order = ref<ProcessedOrder | null>(null);
  const highlightOrderText = ref(false);
  const ordersService = ordersFinishedService();
  const { getOpenOrder, isFetchingOpenOrder, openOrder } = orderOpenService();
  const { createOrder, isCreatingOrder, isNewOrderCreated, newOrder } =
    orderCreateService();
  const {
    deleteOrder,
    isFetchingDeleteOrder,
    orderAfterDelete,
    isOrderDeleted,
  } = orderDeleteService();

  const {
    finishOrder,
    isFetchingOrderFinish,
    orderFinishStatusCode,
    orderFinishError,
  } = orderFinishService();

  const { updateOrder } = orderUpdateService();

  const manageOrder = {
    getOpenOrder: async () => {
      await getOpenOrder().then(() => (order.value = openOrder.value));
    },
    createOrder: async (
      payload: OrderCreatePayload,
      successToast?: boolean,
    ) => {
      await createOrder(payload, successToast).then(() => {
        order.value = newOrder.value;
        highlightOrderText.value = isNewOrderCreated.value;
      });
    },
    deleteOrder: async (id: number) => {
      await deleteOrder(id).then(() => {
        order.value = orderAfterDelete.value;
        highlightOrderText.value = isOrderDeleted.value;
      });
    },
    updateOrder: async (payload: OrderUpdatePayload) => {
      if (!order.value) return;
      await updateOrder(payload);

      if (payload.cdFormaPagamento)
        order.value.paymentFormId = payload.cdFormaPagamento;
      if (payload.cdTransportadora)
        order.value.carrierId = payload.cdTransportadora;
      if (payload.cdVencimento) order.value.dueDateId = payload.cdVencimento;

      if (payload.flRetira) order.value.getOnSite = payload.flRetira;
    },
    finishOrder: async () => {
      await finishOrder().then(() => {
        if (orderFinishStatusCode.value == 200) {
          order.value = null;
        }
      });
    },
  };

  const productService = productsSearchService();

  async function getFinishedOrders() {
    await ordersService
      .get()
      ?.json()
      .execute(true)
      .catch(err => console.log(err));
  }

  async function search(payload: ProductsSearchPayload) {
    await productService
      .post(payload)
      ?.json()
      .execute(true)
      .catch(err => {
        console.error(err);
      });
  }

  function reset(fields: FieldsToReset[] = ['all']) {
    const actions: Record<FieldsToReset, () => void> = {
      filters: () => {
        activeFilters.value = [];
      },
      products: () => {
        productService.data.value = null;
      },
      page: () => {
        page.value = 1;
      },

      all: () => {
        actions.filters();
        actions.products();
        actions.page();
      },
    };

    fields.forEach(item => actions[item]());
  }

  function isFilterSelected(id: string) {
    return activeFilters.value.some(item => item.id == id);
  }
  function selectUnselectFilter(id: string) {
    if (!productService.data.value?.types.length) return false;
    const filter = getFilterByTitle(id, productService.data.value.types);

    if (!filter) return false;
    if (filter?.level != 0 && !isFilterSelected(filter.father?.id as string)) {
      activeFilters.value.push(filter.father as FilterOption);

      if (
        filter.father?.father?.id &&
        !isFilterSelected(filter.father?.father.id)
      ) {
        activeFilters.value.push(filter.father.father);
      }
    }

    if (isFilterSelected(id)) {
      const allTitlesToRemove = getNestedTitles(
        filter,
        activeFilters.value.map(item => item.id),
      );

      activeFilters.value = activeFilters.value.filter(
        item => !allTitlesToRemove.includes(item.id),
      );

      return false;
    }

    activeFilters.value.push(filter);

    return true;
  }

  return {
    search,
    data: productService.data,
    isSearchingProduct: productService.isSearchingProduct,
    isFilterSelected,
    reset,
    selectUnselectFilter,
    activeFilters,
    page,
    getFinishedOrders,
    finishedOrders: ordersService.data,
    isFetchingOrders: ordersService.isFetching,
    getOpenOrder: manageOrder.getOpenOrder,
    isFetchingOpenOrder,
    fetchSimilars: productService.fetchSimilars,
    order,
    isCreatingOrder,
    createOrder: manageOrder.createOrder,
    deleteOrder: manageOrder.deleteOrder,
    highlightOrderText,
    isFetchingDeleteOrder,
    updateOrder: manageOrder.updateOrder,
    finishOrder: manageOrder.finishOrder,
    isFetchingOrderFinish,
    orderFinishStatusCode,
    orderFinishError,
    ...paymentFormService(),
    ...carriersService(),
    ...dueDateService(),
    ...searchPropertiesService(),
    ...vehiclePlateService(),
  };
});
