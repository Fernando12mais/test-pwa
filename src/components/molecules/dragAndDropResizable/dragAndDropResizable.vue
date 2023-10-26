<script setup lang="ts">
  import { Value } from 'sass';
  import { ref, defineProps } from 'vue';
  import Vue3DraggableResizable from 'vue3-draggable-resizable';
  type DragPosition = {
    x: number;
    y: number;
  };
  type DragSize = {
    w: number;
    h: number;
  };

  type ResizeData = DragSize & DragPosition;

  type Props = {
    initialX: number;
    initialY: number;
    height: number;
    width: number;

    active: boolean;
    snap?: {
      colWidth: number;
      rowHeight: number;
    };
  };

  const props = defineProps<Props>();
  const position = ref<DragPosition>({ x: props.initialX, y: props.initialY });
  const size = ref<DragSize>({
    h: props.height,
    w: props.width,
  });

  const currentCol = computed(() => {
    if (!props.snap) return 0;
    return Math.round(position.value.x / props.snap.colWidth);
  });
  const currentRow = computed(() => {
    if (!props.snap) return 0;
    return Math.round(position.value.y / props.snap.rowHeight);
  });

  function onDragStart(value: DragPosition) {
    console.log(value);
  }

  function onDrag(value: DragPosition) {
    position.value = value;

    if (!props.snap) return;
  }

  function calculatePosition() {
    if (!props.snap) return;

    position.value = {
      x: currentCol.value * props.snap.colWidth,
      y: currentRow.value * props.snap.rowHeight,
    };
  }

  function onDragEnd() {
    calculatePosition();
  }
  function onResize({ w, h, x, y }: ResizeData) {
    size.value = { h, w };
    position.value = { x, y };
    console.log(currentCol.value);
  }

  function onResizeEnd() {
    if (!props.snap) return;

    const timesToIncreaseColWidth = Math.round(
      size.value.w / props.snap.colWidth,
    );
    const timesToIncreaseRowHeight = Math.round(
      size.value.h / props.snap.rowHeight,
    );

    size.value = {
      w: timesToIncreaseColWidth * props.snap.colWidth,
      h: timesToIncreaseRowHeight * props.snap.rowHeight,
    };

    calculatePosition();
  }
</script>

<template>
  <Vue3DraggableResizable
    :parent="true"
    :y="position.y"
    :x="position.x"
    :w="size.w"
    :h="size.h"
    @drag-start="onDragStart"
    @drag-end="onDragEnd"
    @dragging="onDrag"
    @resizing="onResize"
    @resize-end="onResizeEnd"
  >
    <slot></slot>
  </Vue3DraggableResizable>
</template>
<!-- @resize-start="print($event)" @dragging="print($event)"
@resizing="print($event)" @drag-end="print($event)" @resize-end="print($event)"
@activated="print($event)" @deactivated="print($event)" -->
