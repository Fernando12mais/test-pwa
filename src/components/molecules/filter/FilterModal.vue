<script setup lang="ts">
  import { useFilterStore, ModalActiveFilter } from '@stores/useFilterStore';
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';

  const props = defineProps<{
    isOpen: boolean;
    title?: string;
    data?: { dsMarca: string; cdMarca: number }[];
    loading: boolean;
  }>();
  defineEmits<{
    onClose: [];
    onSave: [value: ModalActiveFilter[]];
  }>();

  const { selectedFilters } = storeToRefs(useFilterStore());

  const tempData = ref<ModalActiveFilter[]>([]);
  function isTempFilterSelected(filter: ModalActiveFilter) {
    return tempData.value.some(item => item.value == filter.value);
  }

  function selectUnselectTempFilter(filter: ModalActiveFilter) {
    const isFilterSelcted = tempData.value.some(
      item => item.value == filter.value,
    );

    if (isFilterSelcted) {
      tempData.value = tempData.value.filter(
        item => item.value !== filter.value,
      );
      return;
    }
    tempData.value.push(filter);
  }

  const { t } = useI18n<GlobalLocaleSchema>();

  watch(
    () => props.isOpen,
    () => {
      tempData.value = [...selectedFilters.value];
    },
  );
</script>

<template>
  <DialogRoot @on-change="$emit('onClose', $event)" :is-open="$props.isOpen">
    <DialogClose @click="$emit('onClose')" />
    <DialogContent min-height="90vh" :title="$props.title || ''">
      <slot name="prepend" />

      <DialogRow>
        <LoadingRoot class="mx-auto" :size="200" v-if="loading" />

        <div v-else-if="data?.length" class="grid">
          <VCheckbox
            v-for="item in $props.data"
            :model-value="
              isTempFilterSelected({ title: item.dsMarca, value: item.cdMarca })
            "
            @update:model-value="
              selectUnselectTempFilter({
                title: item.dsMarca,
                value: item.cdMarca,
              })
            "
            color="primary"
            :id="item.dsMarca"
            :key="item.dsMarca"
            :label="item.dsMarca"
          >
            <template #label>
              <VTooltip location="bottom">
                <template #activator="{ props }">
                  <span class="label" v-bind="props" :for="item.dsMarca">
                    {{ item.dsMarca }}
                  </span>
                </template>

                {{ item.dsMarca }}
              </VTooltip>
            </template>
          </VCheckbox>
        </div>
        <span v-else>{{ t('serverError.notFound') }}</span>
      </DialogRow>
      <DialogRow>
        <VBtn @click="$emit('onSave', tempData)">{{ t('apply') }}</VBtn>
      </DialogRow>
    </DialogContent>
  </DialogRoot>
</template>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5rem;
  }

  .label {
    max-width: 150px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
  }
</style>
