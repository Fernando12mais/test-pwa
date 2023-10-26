<script setup lang="ts">
  defineProps<{ title: string }>();
</script>

<template>
  <VCard :title="$props.title" class="text-center px-4 py-3">
    <slot />
  </VCard>
</template>
