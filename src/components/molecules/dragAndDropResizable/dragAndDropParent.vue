<script setup lang="ts">
  import { DraggableContainer } from 'vue3-draggable-resizable';

  const props = defineProps<{
    cols: number;
    rowsHeight: number;
    rows: number;
    width: number;
    showGrid?: boolean;
    backgroundColor: string;
  }>();
  const parent = ref<HTMLDivElement>();

  defineEmits<{ onFocus: [value: string] }>();

  const itemsCount = computed(() => {
    if (parent.value) return props.rows * props.cols;
    return 0;
  });

  const grid = computed(() =>
    Array.from({
      length: itemsCount.value,
    }),
  );
</script>

<template>
  <div
    @focusin="$emit('onFocus', backgroundColor)"
    :tabindex="0"
    class="parent"
    ref="parent"
    :style="{ height: `${rowsHeight * rows}px`, width: `${width}px` }"
  >
    {{ parent?.style.backgroundColor }}
    <DraggableContainer :adsorb-parent="false">
      <div
        v-if="showGrid"
        class="grid"
        :style="{
          gridTemplateColumns: `repeat(${cols},1fr)`,
          gridTemplateRows: `repeat(${rows},${rowsHeight}px)`,
        }"
      >
        <span class="item" v-for="(item, index) in grid" :key="index"> </span>
      </div>
      <slot></slot>
    </DraggableContainer>
  </div>
</template>

<style scoped lang="scss">
  .parent {
    position: relative;
    margin: 4px auto;
    background-color: v-bind(backgroundColor);
    box-sizing: content-box;
    border: 1px solid black;
    &:focus {
      background-color: green;
    }
  }

  .grid {
    position: absolute;
    display: grid;
    width: 100%;

    .item {
      border: 1px solid red;
      border-bottom: none;
      border-left: none;
    }
  }
</style>
