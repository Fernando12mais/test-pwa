<script setup lang="ts">
  import { TextFieldRootProps } from './types';
  defineProps<TextFieldRootProps>();
</script>

<template>
  <div class="d-flex align-start gap-2 flex-wrap w-100">
    <SkeletonRoot
      class="v-field v-field__input elevate"
      style="border-radius: 0.375rem"
      v-if="loading"
    />
    <slot v-else></slot>
  </div>
</template>
