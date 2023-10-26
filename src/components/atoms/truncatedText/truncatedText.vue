<script setup lang="ts">
  import { TruncatedTextProps } from './types';
  defineProps<TruncatedTextProps>();
</script>

<template>
  <p class="truncated">{{ text }}</p>
</template>

<style scoped>
  .truncated {
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: v-bind(lineClamp);
    -webkit-box-orient: vertical;
  }
</style>
