<script lang="ts" setup>
  import { emailValidator, requiredValidator } from '@utils/validators';

  const email = ref('');
</script>

<template>
  <VForm>
    <VTextField
      v-model="email"
      :rules="[requiredValidator, emailValidator]"
      label="E-mail"
    />
  </VForm>
</template>
