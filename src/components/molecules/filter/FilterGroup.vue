<script lang="ts" setup>
  import { FilterOption } from '@stores/useFilterStore/types';

  defineProps<{ data: FilterOption; maxLevel: number; loading?: boolean }>();
</script>

<template>
  <div>
    <FilterItem
      v-if="(data.level || 0) >= $props.maxLevel"
      v-bind="data"
      :value="data.value"
    />
    <FilterSubGroup v-else class="text-body-1" v-bind="data">
      <VListItem v-if="$props.loading" class="text-center">
        <LoadingRoot />
      </VListItem>
      <div>
        <FilterGroup
          :max-level="$props.maxLevel"
          v-for="subgroup in data.subgroup"
          :data="subgroup"
          :key="subgroup.title"
          :loading="subgroup.loading"
        />
      </div>
    </FilterSubGroup>
  </div>
</template>
