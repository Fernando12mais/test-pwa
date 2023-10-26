<script setup lang="ts">
  import { Ref, StyleValue } from 'vue';

  defineProps<{
    containerProps: {
      ref: Ref<HTMLElement | null>;
      onScroll: () => void;
      style: StyleValue;
    };
    wrapperProps: {
      style:
        | {
            width: string;
            height: string;
            marginTop: string;
          }
        | {
            width: string;
            height: string;
            marginLeft: string;
            display: string;
          };
    };
  }>();
</script>

<template>
  <div v-bind="containerProps" style="flex: 1; overflow-x: hidden">
    <VCol v-bind="wrapperProps"><slot></slot></VCol>
  </div>
</template>
