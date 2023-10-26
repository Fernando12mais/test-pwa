import { FormGeneratorProps } from '@/components/organisms/formGenerator/types';
import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
import { useProductsStore } from '@/stores/useProductsStore';
import { useUserStore } from '@/stores/useUserStore';
import { finishOrderSchema } from '@/validators/finishOrder';
import { VChip } from 'vuetify/components';

type Fields = Pick<
  FormGeneratorProps<'checkbox' | 'select', typeof finishOrderSchema>,
  'actions' | 'fields'
>;

type Field = Fields['fields'][0];

type ComputedFields = Pick<
  FormGeneratorProps<
    'select' | 'checkbox' | 'custom',
    typeof finishOrderSchema,
    'finishedOrder' | 'goBack'
  >,
  'actions' | 'fields' | 'errorMessage'
>;

export const useFinishOrder = () => {
  const { t } = useI18n<GlobalLocaleSchema>();
  const productStore = useProductsStore();
  const userStore = useUserStore();
  const { getPaymentForms, getDueDate, getCarriers, finishOrder, updateOrder } =
    productStore;

  const { getCreditLimit } = userStore;

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
          value: item?.id?.toString(),
          label: item?.label,
        })),
    ) || [];

  const dueDateItems =
    computed(
      () =>
        dueDate.value?.map(item => ({
          value: item.id?.toString(),
          label: item?.label,
        })),
    ) || [];

  const carrierItems =
    computed(
      () =>
        carriers.value?.map(item => ({
          value: item.id?.toString(),
          label: item.label,
        })),
    ) || [];

  const getOnSite = ref<Field>({
    id: 'getOnSite',
    type: 'checkbox',
    cols: 6,
    props: {
      label: t('messages.pickUpAtTheCounter'),
      value: false,
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
    errorMessage: orderFinishError?.value?.message,
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
        md: true,
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
        id: 'nfe',
        type: 'custom',
        cols: 'auto',

        props: {
          class: 'd-none d-md-flex align-center',
          component: <VChip variant="elevated" text="NFE" />,
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

      {
        id: 'getOnSite',
        type: 'checkbox',
        cols: 6,
        props: {
          label: t('messages.pickUpAtTheCounter'),
          value: getOnSite.value.props.value as boolean,
        },
      },
    ],

    actions: [
      {
        id: 'finishedOrder',
        label: t('messages.sendOrder'),
        color: 'success',
        cols: 'auto',
        class: 'ms-auto',
        type: 'submit',
        loading: isFetchingOrderFinish.value,
      },
      {
        id: 'goBack',
        class: 'mr-auto',
        label: t('back'),
        color: 'error',
        cols: 'auto',
        variant: 'outlined',
        loading: isFetchingOrderFinish.value,
      },
    ],
  }));

  const isFetchingFields = ref(false);

  const onPaymentFormChange = (id: number) => {
    getDueDate(id);

    dueDateValue.value.props.value = '';
  };

  const onGetOnSiteChange = (value: boolean) => {
    carrier.value.props.disabled = value;
  };
  const updateField = (field: string, value: any) => {
    if (isFetchingFields.value) return;
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

  const getFieldValues = async () => {
    if (!order.value) return;
    getCreditLimit();
    orderFinishError.value = {};

    isFetchingFields.value = true;

    if (order.value.paymentFormId) {
      getDueDate(order.value.paymentFormId).then(() => {
        if (dueDateValue.value.type !== 'select') return;

        const defaultValue = dueDate.value.find(
          item => item.id == order.value?.dueDateId,
        );

        if (!defaultValue) return;
        dueDateValue.value.props.value = defaultValue.label;
      });
    }
    getPaymentForms().then(() => {
      if (paymentForm.value.type !== 'select') return;

      const defaultValue = paymentForms.value?.find(
        item => item.id == order.value?.paymentFormId,
      );

      if (!defaultValue) return;
      paymentForm.value.props.value = defaultValue.label;
    });

    await getCarriers().then(() => {
      if (carrier.value.type !== 'select') return;

      const defaultValue = carriers.value?.find(
        item => item.id == order.value?.carrierId,
      );

      if (!defaultValue) return;
      carrier.value.props.value = defaultValue.label;
    });

    getOnSite.value.props.value = !!order.value.getOnSite;

    if (getOnSite.value.props.value) carrier.value.props.disabled = true;
    isFetchingFields.value = false;
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
