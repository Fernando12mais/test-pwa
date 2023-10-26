<script setup lang="ts">
  import Highlighter from 'vue-highlight-words';
  const props = defineProps<{ words: string; highlight: string }>();

  const upperCase = computed(() => ({
    words: props.words.toUpperCase(),
    highlight: props.highlight.toUpperCase(),
  }));
</script>

<template>
  <Highlighter
    highlight-class-name="highlight"
    :text-to-highlight="upperCase.words"
    :search-words="upperCase.highlight.split(' ')"
  />
</template>

<style scoped>
  .highlight {
    background-color: rgb(var(--v-theme-on-warning));
  }
</style>
