<script setup lang="ts">
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import santander from '@/assets/images/banks/santander.png';
  import bb from '@/assets/images/banks/bb.png';

  const { t } = useI18n<GlobalLocaleSchema>();

  function getBankIcon(bank: string) {
    const banks: Record<string, string> = { BRASIL: bb, SANTANDER: santander };

    return banks[bank];
  }

  const data = [
    {
      id: 1,
      invoice: 55369,
      parcel: '01/10',
      payment: 'BOLETO',
      bank: 'BRASIL',
      emission: '14/10/2023',
      dueDate: '20/10/2023',
      value: '350,50',
      status: 'PAGO',
    },
    {
      id: 2,
      invoice: 64567,
      parcel: '05/10',
      payment: 'BOLETO',
      bank: 'SANTANDER',
      emission: '15/10/2023',
      dueDate: '25/10/2023',
      value: '450,50',
      status: 'EM ABERTO',
    },
    {
      id: 3,
      invoice: 64567,
      parcel: '05/10',
      payment: 'BOLETO',
      bank: 'SANTANDER',
      emission: '15/10/2023',
      dueDate: '25/10/2023',
      value: '450,50',
      status: 'EM ABERTO',
    },
    {
      id: 4,
      invoice: 64435,
      parcel: '05/10',
      payment: 'BOLETO',
      bank: 'BRASIL',
      emission: '10/10/2023',
      dueDate: '15/10/2023',
      value: '450,50',
      status: 'VENCIDO',
    },
    {
      id: 4,
      invoice: 64435,
      parcel: '06/10',
      payment: 'BOLETO',
      bank: 'SANTANDER',
      emission: '15/10/2023',
      dueDate: '20/10/2023',
      value: '450,50',
      status: 'PAGO',
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
        <th>{{ t('parcel') }}</th>
        <th class="short">{{ t('payment') }}</th>
        <th>{{ t('bank') }}</th>
        <th class="short">{{ t('emission') }}</th>
        <th>{{ t('dueDate') }}</th>
        <th>{{ t('value') }}</th>
        <th class="short">{{ t('status') }}</th>
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
                title="2ª Via Boleto"
              >
                <VIcon size="17" icon="tabler-square-rounded-number-2" />
              </VBtn>
            </VCol>
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
        <TableExpandableItem>{{ item.parcel }}</TableExpandableItem>
        <TableExpandableItem>{{ item.payment }}</TableExpandableItem>
        <TableExpandableItem class="text-center">
          <div class="d-flex justify-center align-center">
            <VImg
              class="flex-grow-0"
              :src="getBankIcon(item.bank)"
              width="2.5rem"
            />
          </div>
        </TableExpandableItem>
        <TableExpandableItem>{{ item.emission }}</TableExpandableItem>
        <TableExpandableItem>{{ item.dueDate }}</TableExpandableItem>
        <TableExpandableItem class="text-end">{{
          item.value
        }}</TableExpandableItem>
        <TableExpandableItem
          :class="{
            'text-success': item.status == 'PAGO',
            'text-error': item.status == 'VENCIDO',
            'text-purple': item.status == 'EM ABERTO',
          }"
          >{{ item.status }}</TableExpandableItem
        >
      </tr>
    </TableExpandableRoot>
  </Row>
</template>
