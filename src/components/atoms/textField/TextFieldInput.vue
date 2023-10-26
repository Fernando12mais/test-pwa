<script setup lang="ts">
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import { VTextField } from 'vuetify/components/VTextField';
  import { TextFieldInputProps, TextFieldInputEmits } from './types';
  const props = defineProps<TextFieldInputProps>();
  defineEmits<TextFieldInputEmits>();

  const attrs = useAttrs();
  const inputValue = ref(props.defaultValue ? props.defaultValue : '');

  const { t } = useI18n<GlobalLocaleSchema>();

  function handleInputChange(value: string) {
    if (props.masks?.length) {
      props.masks.forEach(mask => (inputValue.value = mask(inputValue.value)));
    }

    if (attrs.type !== 'number') return;

    const parsedValue = Math.abs(Number(value));
    const valueIsGreaterThanMaxAllowed =
      props.maxLength && parsedValue.toString().length > props.maxLength;

    if (isNaN(parsedValue)) {
      inputValue.value = '';
      return;
    }

    inputValue.value = valueIsGreaterThanMaxAllowed
      ? parsedValue.toString().slice(0, props.maxLength)
      : parsedValue.toString();
  }
  const dataCy = computed(() => {
    const formattedLabel = (attrs.name as string)?.replace(/\W/g, '');

    return formattedLabel?.toLowerCase();
  });

  watch(
    () => props.defaultValue,
    () => {
      if (props.defaultValue) inputValue.value = props.defaultValue;
    },
  );
</script>

<template>
  <VTextField
    v-bind="$attrs"
    :error-messages="errorMessages"
    @click:clear="$emit('onClear')"
    clear-icon="tabler-circle-x"
    :label="label"
    variant="outlined"
    persistent-placeholder
    class="v-field--focused"
    :class="{ elevate: !errorMessages }"
    :maxlength="maxLength"
    @input="
      handleInputChange($event.target.value);
      $emit('onInput', inputValue);
    "
    @keydown="$emit('onKeyDown', $event.key)"
    v-model="inputValue"
    @update:model-value="if ($event == null) inputValue = '';"
    density="comfortable"
    clearable
    :data-cy="`input-${dataCy}`"
  >
    <template #append-inner>
      <slot></slot>
    </template>
  </VTextField>
</template>
