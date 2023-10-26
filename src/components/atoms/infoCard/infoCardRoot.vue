<script setup lang="ts">
  type Props = {
    value: string;
    label: string;
  };
  defineProps<Props>();
</script>

<template>
  <VCard class="py-2 position-relative px-3 wrapper">
    <label class="label">{{ label }}</label>
    <div class="font-weight-bold">{{ value }}</div>
  </VCard>
</template>

<style scoped lang="scss">
  .wrapper {
    border-radius: 8px;
    overflow: visible;
    user-select: none;
  }
  .label {
    position: absolute;
    top: 0;
    left: 10%;
    translate: -0% -50%;
    background: rgb(var(--v-theme-surface));
    font-size: 0.875rem;
  }
</style>
