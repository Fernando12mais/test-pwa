<script setup lang="ts">
  import { useProductsStore } from '@stores/useProductsStore';
  import { RootEmitType } from './FilterRoot.vue';
  import { FilterOption } from '@stores/useFilterStore/types';

  const props = defineProps<{
    indeterminate?: boolean;
    icon?: string;
    title: string;
    value?: number;
    level?: number;
    id: string;
    father?: FilterOption;
  }>();

  const { isFilterSelected } = useProductsStore();

  const rootEmit = inject('rootEmit') as RootEmitType;
</script>

<template>
  <VListItem
    density="compact"
    class="text-h6"
    :active="isFilterSelected(props.id)"
    :title="props.title"
    @click="rootEmit('onFilterChange', props)"
  >
    <template #prepend>
      <VCheckbox
        :model-value="isFilterSelected(props.id)"
        @update:model-value="rootEmit('onFilterChange', props)"
      />
      <VIcon v-if="props.icon" :icon="props.icon" />
    </template>
  </VListItem>
</template>
