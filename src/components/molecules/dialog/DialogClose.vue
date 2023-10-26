<script setup lang="ts">
  defineEmits<{ onClose: [] }>();
</script>

<template>
  <DialogCloseBtn @click="$emit('onClose')" />
</template>
