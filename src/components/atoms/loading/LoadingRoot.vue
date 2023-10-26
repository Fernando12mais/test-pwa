<script lang="ts" setup>
  defineProps<{ size?: number }>();
</script>

<template>
  <v-progress-circular
    :size="$props.size || 20"
    color="primary"
    indeterminate
  />
</template>
