<script setup lang="ts">
  import { FilterOption } from '@stores/useFilterStore/types';
  import { RootEmitType } from './FilterRoot.vue';
  import { useProductsStore } from '@stores/useProductsStore';

  const props = defineProps<{
    title: string;
    icon?: string;
    subgroup?: FilterOption[];
    value?: number;
    level?: number;
    loading?: boolean;
    father?: FilterOption;
    id: string;
  }>();

  const rootEmit = inject<RootEmitType>('rootEmit') as RootEmitType;
  const scrollToTop = inject('scrollToTop') as () => void;

  const { isFilterSelected } = useProductsStore();

  const isFilterOpen = () => {
    const group = document.querySelector(
      `[aria-labelledby="v-list-group--id-${props.id}"]`,
    ) as HTMLDivElement;

    console.log(group);

    return group.style.display !== 'none';
  };

  function openClose(open: () => void, id: string) {
    if (!isFilterOpen() && isFilterSelected(id)) {
      open();
    }
    if (isFilterOpen() && !isFilterSelected(id)) {
      open();
    }
  }
</script>

<template>
  <VListGroup active-color="primary" :value="id">
    <template #activator="{ props: activatorProps }">
      <VListItem
        :disabled="$props.loading"
        class="text-h6 item"
        density="compact"
        v-bind="activatorProps"
        @click="rootEmit('onFilterChange', $props, true)"
      >
        <template #prepend>
          <VCheckbox
            :model-value="isFilterSelected($props.id)"
            @click="$event.stopPropagation()"
            @update:model-value="
              rootEmit('onFilterChange', $props);
              if (level == 0) scrollToTop();
              openClose(activatorProps.onClick, id);
            "
          />

          <VIcon v-if="$props.icon" :icon="$props.icon" />
        </template>
        <button
          @click="
            rootEmit('onFilterChange', $props);
            if (level == 0) scrollToTop();
            $event.stopPropagation();
            openClose(activatorProps.onClick, id);
          "
          class="v-list-item-title w-100 text-start"
        >
          {{ title }}
        </button>
      </VListItem>
    </template>

    <slot></slot>
  </VListGroup>
</template>

<style scoped>
  .item :deep(.v-list-item__append .v-icon) {
    margin-inline-start: 0;
  }
</style>
