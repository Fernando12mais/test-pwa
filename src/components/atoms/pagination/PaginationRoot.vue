<script setup lang="ts">
  defineProps<{
    last: number;
    actual: number;
    loading?: boolean;
  }>();

  defineEmits<{
    onPageChange: [value: number];
  }>();
</script>

<template>
  <div class="d-flex align-center gap-1 flex-wrap">
    <slot name="prepend" />

    <VPagination
      :disabled="loading"
      :model-value="actual"
      @update:model-value="$emit('onPageChange', $event)"
      active-color="primary"
      :length="last"
      :total-visible="last > 5 ? undefined : 5"
      :show-first-last-page="true"
    />

    <slot name="append"></slot>
  </div>
</template>
