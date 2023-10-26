<script setup lang="ts">
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import { api } from 'v-viewer';
  const props = defineProps<{ images: string[]; sideToSide?: boolean }>();
  const modalOpen = ref(false);
  const { t } = useI18n<GlobalLocaleSchema>();

  const filteredImages = computed(() => props.images.filter(item => item));

  function open(index: number) {
    api({ images: props.images }).view(index);
  }

  function handleOpen() {
    if (props.sideToSide) {
      modalOpen.value = true;
      return;
    }

    open(0);
  }
</script>

<template>
  <VImg
    style="cursor: pointer"
    v-for="image in filteredImages"
    :key="image"
    v-bind="$attrs"
    :src="image"
    @click="handleOpen"
  />

  <VDialog v-model="modalOpen" style="z-index: 1500">
    <DialogCloseBtn @click="modalOpen = false" />
    <VCard class="pa-2">
      <VRow>
        <VCol
          class="d-flex"
          style="height: 70vh"
          v-for="(image, index) in filteredImages"
          :key="image"
        >
          <VImg style="cursor: pointer" :src="image" @click="open(index)" />
        </VCol>
      </VRow>
      <VRow>
        <VCol class="d-flex justify-center mt-4">
          <VBtn @click="modalOpen = false">{{ t('back') }}</VBtn>
        </VCol>
      </VRow>
    </VCard>
  </VDialog>
</template>
