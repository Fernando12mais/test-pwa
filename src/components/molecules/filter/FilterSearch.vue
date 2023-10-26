<script setup lang="ts">
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import { useField, useForm } from 'vee-validate';
  import { searchSchema } from '@validators/components/filter';

  const emit = defineEmits({
    onSearch: (value: string) => true,
  });
  const { t } = useI18n<GlobalLocaleSchema>();

  const { handleSubmit } = useForm({ validationSchema: searchSchema });

  const search = useField('search');

  const onSubmit = handleSubmit(data => {
    emit('onSearch', data.search || '');
  });
</script>

<template>
  <DialogRow style="flex-grow: 0">
    <VForm @submit="onSubmit">
      <TextFieldRoot :loading="false">
        <TextFieldInput
          v-model="search.value.value"
          @on-clear="$emit('onSearch', '')"
        />
        <TextFieldButton type="submit"> {{ t('search') }}</TextFieldButton>
      </TextFieldRoot>
    </VForm>
  </DialogRow>
</template>
