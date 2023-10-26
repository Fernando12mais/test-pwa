<script setup lang="ts">
  import { useDisplay } from 'vuetify/lib/framework.mjs';
  const props = defineProps<{ timeout?: number }>();

  const isAnimationComplete = ref(false);

  setTimeout(() => {
    isAnimationComplete.value = true;
  }, props.timeout || 3000);

  defineEmits<{ onAnimationEnd: [] }>();

  const { smAndUp } = useDisplay();
</script>

<template>
  <div :class="$style.container" :style="{ top: smAndUp ? '0.5rem' : '4rem' }">
    <slot></slot>
  </div>
</template>

<style module>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: fixed;

    right: 0;
    z-index: 10090;
    max-height: 70vh;
  }

  .slideIn {
    animation: slideIn 0.5s ease-out forwards;
  }
  .slideOut {
    animation: slideOut 1s ease-out forwards;
  }
  @keyframes slideIn {
    from {
      translate: 100% 0;
    }

    to {
      translate: -1rem 0;
    }
  }
  @keyframes slideOut {
    to {
      translate: 100% 0;
    }
    40% {
      translate: -3rem 0;
    }

    20% {
      translate: -2rem 0;
    }

    0% {
      translate: -1rem 0;
    }
  }
</style>
