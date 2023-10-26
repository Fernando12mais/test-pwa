<script setup lang="ts">
  defineProps<{ details: string[]; highlight?: string }>();
</script>

<template>
  <VCol cols="12" class="px-0 pt-2 d-flex align-end flex-fill">
    <ul class="list w-100">
      <li v-for="detail in details" :key="detail">
        <HighlighterRoot
          v-if="highlight"
          :words="detail"
          :highlight="highlight"
        />
        <span v-else>{{ detail }}</span>
      </li>
    </ul>
  </VCol>
</template>

<style scoped>
  .list {
    display: flex;
    flex-wrap: wrap;
    color: rgb(var(--v-theme-grey-900));
  }
  .list li {
    padding: 0 0.25rem;
    border-left: 1px solid rgb(var(--v-theme-grey-600));
  }
</style>
