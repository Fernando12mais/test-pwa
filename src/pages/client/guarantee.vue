<script setup lang="ts">
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import { formatMoney } from '@/utils/formatters';

  const { t } = useI18n<GlobalLocaleSchema>();

  const data = [
    {
      id: 1,
      invoice: 55369,
      emission: '14/10/2023',
      items: 399.71,
      freight: 70.99,
    },
    {
      id: 2,
      invoice: 55559,
      emission: '20/10/2023',
      items: 299.52,
      freight: 50.99,
    },
    {
      id: 3,
      invoice: 53369,
      emission: '23/10/2023',
      items: 150.72,
      freight: 20.69,
    },
    {
      id: 4,
      invoice: 53889,
      emission: '23/10/2023',
      items: 170.95,
      freight: 40.52,
    },
    {
      id: 5,
      invoice: 53889,
      emission: '23/10/2023',
      items: 280.92,
      freight: 80.25,
    },
    {
      id: 6,
      invoice: 59766,
      emission: '23/10/2023',
      items: 320.9,
      freight: 50.55,
    },
    {
      id: 7,
      invoice: 73889,
      emission: '23/10/2023',
      items: 120.92,
      freight: 44.45,
    },
    {
      id: 8,
      invoice: 67889,
      emission: '23/10/2023',
      items: 260.9,
      freight: 120.75,
    },
    {
      id: 9,
      invoice: 60089,
      emission: '23/10/2023',
      items: 310.55,
      freight: 34.75,
    },
    {
      id: 10,
      invoice: 63339,
      emission: '23/10/2023',
      items: 410.55,
      freight: 94.55,
    },
  ];
</script>
<template>
  <Row>
    <FilterStatus class="mb-4"></FilterStatus>

    <TableExpandableRoot :loading="false" height="80vh">
      <template #header>
        <th>{{ t('actions') }}</th>
        <th>{{ t('invoice') }}</th>
        <th>{{ t('emission') }}</th>
        <th>{{ t('items') }}</th>
        <th>{{ t('freight') }}</th>
        <th>{{ t('value') }}</th>
      </template>

      <tr v-for="item in data" :key="item.id" class="py-4">
        <TableExpandableItem>
          <VRow>
            <VCol>
              <VBtn
                block
                variant="tonal"
                size="27"
                color="#4473C5"
                class="rounded"
                title="DANFE"
              >
                <VIcon size="17" icon="tabler-receipt" />
              </VBtn>
            </VCol>
            <VCol>
              <VBtn
                block
                variant="tonal"
                size="27"
                color="#4473C5"
                class="rounded"
                title="XML"
              >
                <VIcon size="17" icon="tabler-file-type-xml" />
              </VBtn>
            </VCol>
            <VCol>
              <VBtn
                block
                variant="tonal"
                size="27"
                color="#4473C5"
                class="rounded"
                title="Dados Nota"
              >
                <VIcon size="17" icon="tabler-file-invoice" />
              </VBtn>
            </VCol>
          </VRow>
        </TableExpandableItem>
        <TableExpandableItem>{{ item.invoice }}</TableExpandableItem>
        <TableExpandableItem>{{ item.emission }}</TableExpandableItem>
        <TableExpandableItem class="text-end">{{
          formatMoney(item.items)
        }}</TableExpandableItem>
        <TableExpandableItem class="text-end">{{
          formatMoney(item.freight)
        }}</TableExpandableItem>
        <TableExpandableItem class="text-end">{{
          formatMoney(item.items + item.freight)
        }}</TableExpandableItem>
      </tr>
    </TableExpandableRoot>
  </Row>
</template>
