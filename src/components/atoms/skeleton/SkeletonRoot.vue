<script setup lang="ts">
  defineProps<{
    as?: string;
    circle?: boolean;
    pill?: boolean;
    shimmer?: boolean;
    size?: string | number;
    width?: string | number;
    height?: string | number;
  }>();
</script>

<template>
  <Skeletor v-bind="$props" :shimmer="true" class="main-color elevate" />
</template>

<style scoped>
  .main-color {
    background-color: rgba(var(--v-theme-on-surface), 0.3);
  }
</style>
