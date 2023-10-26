<script
  setup
  lang="ts"
  generic="
    T extends keyof Fields,
    P extends ZodObject<ZodRawShape>,
    K extends string
  "
>
  import { useField, useForm } from 'vee-validate';
  import { Fields, FormGeneratorProps } from './types';
  import { ZodObject, ZodRawShape, output } from 'zod';
  import { toTypedSchema } from '@vee-validate/zod';
  import { Ref } from 'vue';
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';

  const props = defineProps<FormGeneratorProps<T, P, K>>();

  const emits = defineEmits({
    onSubmit: (action: output<P>) => true,
    onAction: (action: { action: K; data: output<P> }) => true,
    onFieldUpdate: (data: { id: keyof P['_input']; value: unknown }) => true,
  });
  const { handleSubmit, setFieldValue } = useForm({
    validationSchema: toTypedSchema(props.schema),
  });
  const { t } = useI18n<GlobalLocaleSchema>();
  const fieldsRefs = props.fields.map(item => useField(item.id.toString()));
  const params = useUrlSearchParams('history');

  const onSubmit = handleSubmit(data => {
    emits('onSubmit', data);

    for (const key in data) {
      params[key] = data[key];
    }
  });
  const emitAction = (action: string) => {
    const data = fieldsRefs.reduce((acc: Record<string, unknown>, item) => {
      const name = item.name as Ref<string>;
      acc[name.value] = item.value.value;
      return acc;
    }, {});

    emits('onAction', { action: action as K, data });
  };

  const updateAndEmitField = (index: number, value: unknown, id: string) => {
    emits('onFieldUpdate', { id: id as keyof P['_input'], value });
  };
  onMounted(() => {
    for (const key in params) {
      fieldsRefs.forEach(field => {
        const name = field.name as Ref<string>;

        if (name.value == key) field.value.value = params[key];
      });
    }
  });

  watchEffect(() => {
    props.fields.forEach((item, index) => {
      if (item.type == 'select' || item.type == 'checkbox') {
        fieldsRefs[index].value.value = item.props.value;
      }

      if (item.type == 'input') {
        fieldsRefs[index].value.value = item.props.input?.defaultValue;
      }
    });
  });
</script>

<template>
  <VForm @submit.prevent="onSubmit">
    <VRow>
      <VCol
        v-for="(field, index) in fields"
        :key="index"
        :cols="field.cols"
        :sm="field.sm"
        :md="field.md"
        :lg="field.lg"
        :xl="field.xl"
        :xxl="field.xxl"
      >
        <SkeletonRoot
          v-if="
            field.type == 'input'
              ? field.props.root?.loading
              : field.props.loading
          "
          height="48"
        />
        <TextFieldRoot
          v-else-if="field.type == 'input'"
          v-bind="field.props.root || { loading: false }"
        >
          <TextFieldInput
            v-bind="field.props.input"
            @on-input="updateAndEmitField(index, $event, field.id.toString())"
            :default-value="fieldsRefs[index].value.value"
            :error-messages="t(fieldsRefs[index].errorMessage.value || '')"
          />
        </TextFieldRoot>

        <VSelect
          style="border-radius: 6px"
          :class="{ elevate: !fieldsRefs[index].errorMessage.value }"
          density="comfortable"
          persistent-placeholder
          v-else-if="field.type == 'select'"
          v-bind="field.props"
          item-title="label"
          item-value="value"
          :model-value="fieldsRefs[index].value.value"
          @update:model-value="
            updateAndEmitField(index, $event, field.id.toString())
          "
          :error-messages="t(fieldsRefs[index].errorMessage.value || '')"
        />

        <VCheckbox
          v-else-if="field.type == 'checkbox'"
          :model-value="fieldsRefs[index].value.value"
          :label="field.props.label"
          @update:model-value="
            updateAndEmitField(index, $event, field.id.toString())
          "
        />
      </VCol>

      <VCol
        v-for="action in actions"
        :key="action.id"
        :cols="action.cols"
        :sm="action.sm"
        :md="action.md"
        :lg="action.lg"
        :xl="action.xl"
        :xxl="action.xxl"
      >
        <VBtn
          :disabled="action.loading"
          :loading="action.loading"
          @click="emitAction(action.id)"
          :type="action.type"
          :color="action.color || 'primary'"
        >
          {{ action.label }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
