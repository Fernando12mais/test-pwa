<script setup lang="ts">
  const props = defineProps<{ open: boolean }>();
  defineEmits<{ onChange: [] }>();

  watchEffect(() => {
    const body = document.querySelector('body');

    if (props.open) body?.classList.add('no-overflow');
    else body?.classList.remove('no-overflow');
  });
</script>

<template>
  <VNavigationDrawer
    @update:model-value="$emit('onChange')"
    style="padding: 0.5rem; border-radius: 0.375rem"
    class="elevate-1"
    :model-value="open"
    @click="console.log($event)"
    @scroll="console.log($event)"
  >
    <button @click="$emit('onChange')" size="small" class="btn-close">
      <VIcon
        color="primary"
        size="1.5rem"
        :icon="`tabler-circle-arrow-${open ? 'left' : 'right'}-filled`"
      />
    </button>
    <slot></slot>
  </VNavigationDrawer>
</template>

<style scoped>
  .btn-close {
    position: absolute;
    right: 0;
    z-index: 1;
    background-color: transparent !important;
    padding: 0 !important;
    translate: 50%;
  }
</style>
