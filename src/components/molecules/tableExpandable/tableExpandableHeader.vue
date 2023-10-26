<template>
  <thead class="bg-primary header">
    <tr class="text-uppercase">
      <slot></slot>
    </tr>
  </thead>
</template>

<style scoped>
  .header {
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>
