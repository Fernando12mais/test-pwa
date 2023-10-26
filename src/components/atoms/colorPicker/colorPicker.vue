<script setup lang="ts">
  type Props = {
    active?: boolean;
    value?: string;
  };
  defineProps<Props>();
  defineEmits<{ onInput: [value: string] }>();
</script>

<template>
  <label class="wrapper" :style="{ backgroundColor: value }">
    <input
      :value="value"
      type="color"
      @input="$emit('onInput', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>

<style scoped lang="scss">
  .wrapper {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    transition: all 0.25s ease;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    input {
      border: none;
      visibility: hidden;
      width: 0;
      height: 0;
    }
  }
</style>
