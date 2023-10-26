<script setup lang="ts">
  import { Toast } from '@stores/useToastStore/types';

  const props = defineProps<{ toast?: Toast }>();

  const isAnimationComplete = ref(false);

  setTimeout(
    () => {
      isAnimationComplete.value = true;
    },
    props.toast?.timeout || 3000,
  );

  defineEmits<{ onAnimationEnd: [] }>();
</script>

<template>
  <div
    @animationend="
      e => {
        if (e.animationName.includes('slideOut'))
          $emit('onAnimationEnd', props.toast?.id);
      }
    "
    :class="isAnimationComplete ? $style.slideOut : $style.slideIn"
  >
    <VAlert :color="toast?.color">
      <slot></slot>
    </VAlert>
  </div>
</template>

<style module>
  .shrink {
    animation: shrink 0.5s forwards;
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
