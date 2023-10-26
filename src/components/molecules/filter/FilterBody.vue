<script setup lang="ts">
  import { FilterData } from '@stores/useFilterStore/types';
  import FilterGroup from './FilterGroup.vue';

  const props = defineProps<{
    data: FilterData;
    activeFilters: string[];
    maxLevel: number;
    loading?: boolean;
  }>();

  const prepend = ref<HTMLDivElement>();
  const listId = ref(`id-list`);

  const sortedFilters = computed(() => {
    const filters = [...props.data.filters];

    filters.sort((a, b) => {
      const aIndex = props.activeFilters.findIndex(item => item == a.title);
      const bIndex = props.activeFilters.findIndex(item => item == b.title);

      if (aIndex > bIndex) return -1;
      if (bIndex > aIndex) return 1;

      return 0;
    });
    return filters;
  });

  const lastActiveFilter = computed(() => {
    const index = sortedFilters.value.findIndex(
      item => item.title == props.activeFilters.at(0),
    );

    return index;
  });
  const { intersected } = useCssModule();

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          prepend.value?.classList.add(intersected);
        } else {
          prepend.value?.classList.remove(intersected);
        }
      });
    },
    { threshold: 1 },
  );
  onMounted(() => {
    if (!prepend.value) return;

    observer.observe(prepend.value);
  });

  onUnmounted(() => {
    observer.disconnect();
  });
  function scrollToTop() {
    const list = document.querySelector(`#${listId.value}`);

    list?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  provide('scrollToTop', scrollToTop);
</script>

<template>
  <VList :id="listId" style="overflow-y: auto" :class="$style.scrollable">
    <div ref="prepend">
      <VListItem
        v-if="$slots.prepend && $slots.prepend()?.length"
        class="py-0 d-flex"
      >
        <slot name="prepend" />
      </VListItem>
    </div>

    <div v-for="(filter, index) in sortedFilters" :key="filter.title">
      <FilterGroup
        :data="{ ...filter, loading: props.loading }"
        :max-level="props.maxLevel"
        :loading="filter.loading"
      />

      <VDivider v-if="index == lastActiveFilter" color="primary" />

      <slot />
    </div>
  </VList>
</template>

<style module>
  .intersected {
    position: sticky;
    top: calc(-0.5rem - 1px);
    z-index: 10;
    background-color: rgb(var(--v-theme-background));
  }

  .scrollable {
    max-height: 100%;
    overflow: auto;
    position: relative;
  }
</style>
