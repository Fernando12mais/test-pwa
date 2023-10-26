<script setup lang="ts">
  import { TextFieldButtonEmits } from './types';
  defineEmits<TextFieldButtonEmits>();
</script>

<template>
  <VBtn
    :size="$vuetify.display.smAndDown ? 'small' : 'default'"
    :icon="$vuetify.display.smAndDown"
    @click="$emit('onClick')"
  >
    <VIcon icon="tabler-search" />
    <span v-if="$vuetify.display.mdAndUp" class="ms-3"><slot></slot></span>
  </VBtn>
</template>
