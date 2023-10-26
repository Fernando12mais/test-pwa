<script lang="ts" setup>
  const wrapperRef = ref<HTMLDivElement>();
  const props = defineProps<{ top?: boolean; observe: boolean }>();

  const emits = defineEmits({ onIntersect: () => true });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.boundingClientRect.y > 0 && props.top) {
        emits('onIntersect');
      }
    });
  });
  onMounted(() => {
    if (!props.observe) return;
    if (!wrapperRef.value) return;

    observer.observe(wrapperRef.value);

    return () => {
      if (!wrapperRef.value) return;
      observer.unobserve(wrapperRef.value);
    };
  });

  watchEffect(() => {
    if (!wrapperRef.value) return;
    if (!props.observe) {
      observer.unobserve(wrapperRef.value);
    } else {
      observer.observe(wrapperRef.value);
    }
  });
</script>

<template>
  <div ref="wrapperRef"><slot></slot></div>
</template>
