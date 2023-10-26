<script setup lang="ts">
  //   const props = defineProps<{
  //     period?: boolean;
  //   }>();

  const selectedOptions = ref(['TODAS']);
  const dateRange = ref('');

  const status = ['TODAS', 'EM ABERTO', 'PAGO', 'VENCIDO'];
</script>

<template>
  <VCard>
    <VCardItem class="py-4">
      <VRow>
        <VCol>
          <AppDateTimePicker
            density="comfortable"
            class="pt-1"
            v-model="dateRange"
            label="Período"
            :config="{ mode: 'range' }"
          />
        </VCol>
        <VCol>
          <VSelect
            density="comfortable"
            class="py-1"
            :model-value="selectedOptions"
            :items="status"
            :menu-props="{ maxHeight: '400' }"
            label="Status"
            persistent-hint
          />
        </VCol>
      </VRow>
    </VCardItem>
  </VCard>
</template>
