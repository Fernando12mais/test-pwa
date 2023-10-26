<script lang="ts" setup>
  import { TableExpandableRootProps } from './tableExpandableTypes';
  const props = defineProps<TableExpandableRootProps>();
  const slots = useSlots();

  provide(
    'headers-length',
    props.headersLength || slots.header?.().length || 0,
  );
</script>

<template>
  <SkeletonRoot
    class="d-none d-md-block"
    v-if="loading"
    :height="$attrs.height ? ($attrs.height as string) : '100px'"
  />

  <VTable
    v-bind="$attrs"
    v-else
    density="compact"
    class="table d-none d-md-table w-100"
    style="border-radius: 0.375rem"
  >
    <thead class="bg-primary header">
      <tr class="text-uppercase">
        <slot name="header" />
      </tr>
    </thead>

    <tbody>
      <slot></slot>
    </tbody>
  </VTable>
</template>

<style scoped>
  .header {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .table :deep(th) {
    background-color: rgb(var(--v-theme-primary));
    text-align: center !important;
  }

  .table :deep(tbody tr:nth-of-type(even)) {
    /* background-color: black; */
    background-color: rgba(var(--v-theme-secondary), 0.4);
  }
  .table :deep(.table) {
    padding: 0.125rem 1rem;
    padding-top: 0;
  }

  .table:deep(.table td),
  .table :deep(.table th) {
    border: 0.0625rem solid rgba(var(--v-theme-on-surface), 0.5);
  }
  .table:deep(.table td:nth-of-type(even)),
  .table:deep(.table th:nth-of-type(even)) {
    border-left: none;
    border-right: none;
  }

  .table :deep(.table th) {
    border-top: none;
  }
</style>
