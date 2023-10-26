<script setup lang="ts">
  const isOpen = ref(false);

  const headersLength = inject('headers-length') as number;

  function toggleList() {
    isOpen.value = !isOpen.value;
  }
</script>

<template>
  <tr
    @click="toggleList"
    v-ripple
    class="list"
    :class="{ 'list-open': isOpen }"
    v-bind="$attrs"
  >
    <slot></slot>
  </tr>

  <div role="row" style="display: table-row; box-shadow: 1px 1px 1px black">
    <td :style="{ height: isOpen ? 'auto' : 0 }" :colspan="headersLength">
      <div :class="`wrapper ${isOpen ? 'open' : ''}`">
        <div class="container">
          <slot name="expandable-content"></slot>
        </div>
      </div>
    </td>
  </div>
</template>

<style scoped>
  .list {
    cursor: pointer;
    transition: background 0.3s;
  }
  .list + tr :deep(.v-table) {
    background: rgba(var(--v-theme-on-surface), 0.05);
  }
  :is(.list:not(.list-open)):hover {
    background: rgba(var(--v-theme-on-surface), 0.3);
  }

  .list-open {
    background: rgba(var(--v-theme-primary), 0.4) !important;
  }
  .wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease-in-out;
  }
  .open {
    grid-template-rows: 1fr;
  }

  .container {
    overflow: hidden;
  }
</style>
