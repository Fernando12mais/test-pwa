import { FormGeneratorProps } from '@/components/organisms/formGenerator/types';
import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
import { useProductsStore } from '@/stores/useProductsStore';
import { finishOrderSchema } from '@/validators/finishOrder';

type Fields = Pick<
  FormGeneratorProps<'checkbox' | 'select', typeof finishOrderSchema>,
  'actions' | 'fields'
>;

type Field = Fields['fields'][0];

type ComputedFields = Pick<
  FormGeneratorProps<'select' | 'checkbox', typeof finishOrderSchema>,
  'actions' | 'fields'
>;

export const useFinishOrder = () => {
  const { t } = useI18n<GlobalLocaleSchema>();
  const productStore = useProductsStore();
  const { getPaymentForms, getDueDate, getCarriers, finishOrder, updateOrder } =
    productStore;

  const {
    order,
    dueDate,
    paymentForms,
    carriers,
    orderFinishError,
    isFetchingOrderFinish,
    isFetchingDueDate,
    isFetchingCarriers,
    isFetchingPaymentForm,
  } = storeToRefs(productStore);
  const paymentForm = ref<Field>({
    id: 'paymentForm',
    type: 'select',
    props: {
      items: [],
      label: t('messages.paymentForm'),
    },
  });

  const paymentItems =
    computed(
      () =>
        paymentForms.value?.map(item => ({
          value: item.id.toString(),
          label: item.label,
        })),
    ) || [];

  const dueDateItems =
    computed(
      () =>
        dueDate.value?.map(item => ({
          value: item.id.toString(),
          label: item.label,
        })),
    ) || [];

  const carrierItems =
    computed(
      () =>
        carriers.value?.map(item => ({
          value: item.id.toString(),
          label: item.label,
        })),
    ) || [];

  const getOnSite = ref<Field>({
    id: 'getOnSite',
    type: 'checkbox',
    props: {
      label: t('messages.pickUpAtTheCounter'),
    },
  });

  const carrier = ref<Field>({
    id: 'carrier',
    type: 'select',

    props: {
      items: [],
      label: t('carrier'),
    },
  });

  const dueDateValue = ref<Field>({
    id: 'dueDate',
    type: 'select',

    props: {
      items: [],
      label: t('dueDate'),
    },
  });

  const data = computed<ComputedFields>(() => ({
    actions: [
      {
        id: 'finishOrder',
        label: t('messages.finishOrder'),
        color: 'success',
        cols: 12,
        type: 'submit',
        loading: isFetchingOrderFinish.value,
      },
    ],
    fields: [
      {
        id: 'paymentForm',
        type: 'select',
        cols: 12,
        md: 6,
        props: {
          items: [...(paymentItems.value || [])],
          label: paymentForm.value.props.label,
          value: paymentForm.value.props.value as string,
          loading: isFetchingPaymentForm.value,
        },
      },

      {
        cols: 12,
        md: 6,
        id: 'dueDate',
        type: 'select',
        props: {
          items: [...(dueDateItems.value || [])],
          label: dueDateValue.value.props.label,
          value: dueDateValue.value.props.value as string,
          loading: isFetchingDueDate.value,
        },
      },
      {
        cols: 12,
        md: 6,
        id: 'carrier',
        type: 'select',
        props: {
          disabled: carrier.value.props.disabled,
          items: [...(carrierItems.value || [])],
          label: carrier.value.props.label,
          value: carrier.value.props.value as string,
          loading: isFetchingCarriers.value,
        },
      },
      getOnSite.value,
    ],
  }));

  const onPaymentFormChange = (id: number) => {
    getDueDate(id);

    dueDateValue.value.props.value = '';
  };

  const onGetOnSiteChange = (value: boolean) => {
    carrier.value.props.disabled = value;
  };
  const updateField = (field: string, value: any) => {
    if (field == 'paymentForm') {
      paymentForm.value.props.value = value;
      updateOrder({ cdFormaPagamento: Number(value) });
      onPaymentFormChange(Number(value));
    }
    if (field == 'carrier') {
      carrier.value.props.value = value;
      updateOrder({ cdTransportadora: Number(value) });
    }
    if (field == 'dueDate') {
      dueDateValue.value.props.value = value;
      updateOrder({ cdVencimento: Number(value) });
    }

    if (field == 'getOnSite') {
      getOnSite.value.props.value = value;
      updateOrder({ flRetira: value });
      onGetOnSiteChange(value as boolean);
    }
  };

  const getFieldValues = () => {
    if (!order.value) return;

    getDueDate(order.value.paymentFormId).then(() => {
      if (dueDateValue.value.type !== 'select') return;

      const defaultValue = dueDate.value.find(
        item => item.id == order.value?.dueDateId,
      );

      if (!defaultValue) return;
      dueDateValue.value.props.value = defaultValue.label;
    });
    getPaymentForms().then(() => {
      if (paymentForm.value.type !== 'select') return;

      const defaultValue = paymentForms.value?.find(
        item => item.id == order.value?.paymentFormId,
      );

      if (!defaultValue) return;
      paymentForm.value.props.value = defaultValue.label;
    });

    getCarriers().then(() => {
      if (carrier.value.type !== 'select') return;

      const defaultValue = carriers.value?.find(
        item => item.id == order.value?.carrierId,
      );

      if (!defaultValue) return;
      carrier.value.props.value = defaultValue.label;
    });

    getOnSite.value.props.value = !!order.value.getOnSite;
  };

  return {
    sendOrderFormData: data,
    finishOrderSchema,
    getFieldValues,
    onPaymentFormChange,
    onGetOnSiteChange,
    updateField,
    finishOrder,
    orderFinishError,
  };
};
