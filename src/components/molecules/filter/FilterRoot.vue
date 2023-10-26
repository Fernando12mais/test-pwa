<script setup lang="ts">
  import { FilterOption } from '@stores/useFilterStore/types';

  defineProps<{ loading: boolean }>();

  const rootEmit = defineEmits<{
    onFilterChange: [filter: FilterOption, isExpanding?: boolean];
  }>();

  export type RootEmitType = typeof rootEmit;

  provide('rootEmit', rootEmit);
</script>

<template>
  <SkeletonRoot v-if="loading" height="100%" />

  <VCard v-else>
    <slot></slot>
  </VCard>
</template>
