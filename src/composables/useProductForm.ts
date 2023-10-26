import { useUserStore } from '@/stores/useUserStore';
import { formatMoney } from '../utils/formatters';
import { orderItemAvailableService } from '@/services/orderItemAvailable';
import { focusOnInput } from '../utils/dom';
import { useProductsStore } from '@/stores/useProductsStore';

type Props<T extends Record<string, unknown>> = {
  quantity?: number;
  price: number;
  id: number;
  index: number;
  loadingRef: T;
  loadingKey: keyof T;
  oldPrice?: number;
};

export function useProductForm<T extends Record<string, unknown>>(
  props: Props<T>,
) {
  type Key = keyof typeof keyEvents;

  const UserStore = useUserStore();
  const ProductStore = useProductsStore();
  const { createOrder, deleteOrder } = ProductStore;

  const quantity = ref(props.quantity || 0);

  const total = computed(() => ({
    isEmpty: quantity.value == 0,
    price: formatMoney(props.price),
    formattedPrice: formatMoney(quantity.value * props.price),
    calculatedOldPrice: formatMoney(quantity.value * (props.oldPrice || 0)),
  }));
  const {
    isFetching: isVerifyingAvailability,
    data: availability,
    verifyAvailability,
  } = orderItemAvailableService();

  const verified = ref(false);

  const payload = computed(() => ({
    cdItem: props.id,
    nrQuantidade: quantity.value,
  }));

  const keyEvents = {
    arrowdown: async () => {
      focusOnInput(`id-${props.index + 1}`);
    },
    arrowup: () => {
      focusOnInput(`id-${props.index - 1}`);
    },
  };

  function onKeyDown(value: string) {
    const event = keyEvents[value as Key];

    if (!event) return;
    event();
  }

  async function manageCreateOrder() {
    (props.loadingRef[props.loadingKey] as boolean) = true;
    await createOrder(payload.value, true);
    await UserStore.getCreditLimit();
    (props.loadingRef[props.loadingKey] as boolean) = false;
  }

  async function onSubmit() {
    if (!UserStore.userData?.user?.cdEmpresa) return;
    if (!quantity.value) return;
    if (!availability.value?.disponivel) {
      verifyAvailability({
        cdEmpresa: UserStore.userData.user.cdEmpresa,
        cdItem: props.id,
        nrQuantidade: quantity.value,
      }).then(async () => {
        if (!availability.value?.disponivel) return;
        verified.value = true;
        await manageCreateOrder();
      });

      return;
    }

    await manageCreateOrder();
  }

  async function manageDeleteOrder(id: number) {
    (props.loadingRef[props.loadingKey] as boolean) = true;
    await deleteOrder(id);
    await UserStore.getCreditLimit();
    (props.loadingRef[props.loadingKey] as boolean) = false;
  }

  return {
    quantity,
    total,
    availability,
    verifyAvailability,
    onSubmit,
    onKeyDown,
    isVerifyingAvailability,
    payload,
    manageCreateOrder,
    manageDeleteOrder,
  };
}
