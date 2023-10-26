<script setup lang="ts">
  defineProps<{ loading: boolean }>();
</script>

<template>
  <SkeletonRoot v-if="loading" height="200" />

  <VCard
    class="elevate-1"
    style="background-color: rgb(var(--v-theme-surface))"
    v-else
  >
    <div class="row px-2">
      <slot></slot>
    </div>
  </VCard>
</template>
