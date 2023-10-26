<script setup lang="ts">
  type Props = {
    clamp?: number;
  };

  defineProps<Props>();
</script>

<template>
  <td class="text-center">
    <p v-if="clamp" :class="`line-clamp-${clamp} mb-0`">
      <slot></slot>
    </p>
    <slot v-else></slot>
  </td>
</template>
