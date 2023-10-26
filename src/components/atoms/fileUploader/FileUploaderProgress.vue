<script setup lang="ts">
  defineProps<{ percentage: number }>()
</script>

<template>
  <VProgressCircular
    v-if="$props.percentage"
    :rotate="360"
    :size="70"
    :width="6"
    :model-value="$props.percentage"
    color="primary"
  >
    {{ $props.percentage }}%
  </VProgressCircular>
</template>
