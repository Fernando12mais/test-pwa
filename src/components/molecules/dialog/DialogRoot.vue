<script lang="ts" setup>
  defineProps<{ isOpen?: boolean }>();
  defineEmits<{ onChange: [value: boolean] }>();
</script>

<template>
  <VDialog
    style="align-items: start"
    :model-value="$props.isOpen"
    @update:model-value="
      $emit('onChange', $event);
      console.log($event);
    "
  >
    <slot />
  </VDialog>
</template>
