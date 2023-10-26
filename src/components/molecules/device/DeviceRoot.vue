<script setup lang="ts">
  import type { Device, DeviceData } from '@composables/useDevice';

  defineProps<{
    device: Device;
    deviceData: DeviceData;
  }>();
</script>

<template>
  <div
    class="mobile"
    :style="{
      width: `${deviceData.width}px`,
      height: `${deviceData.height}px`,
    }"
  >
    <header class="header">
      <div class="container"></div>
    </header>

    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .mobile {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    border-radius: 2rem;
    border: 0.0625rem solid black;
    background-color: black;

    .header {
      display: flex;
      justify-content: center;

      height: 1.5rem;
      background-color: white;
      border-top-left-radius: 24px;
      border-top-right-radius: 24px;
      position: relative;

      .container {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        height: 100%;
        background-color: black;
        top: 0;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        gap: 10px;
        &:before {
          content: '';
          display: block;
          width: 50px;
          height: 30%;
          background-color: white;
          border-radius: 30px;
        }
        &:after {
          content: '';
          display: block;
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
        }
      }
    }
    .body {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
      flex: 1;
      border-bottom-left-radius: 24px;
      border-bottom-right-radius: 24px;
      background-color: white;
    }
  }
</style>
