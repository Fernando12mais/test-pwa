<script setup lang="ts">
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import qrCode from '@/assets/images/qr-code.png';
  import pix from '@/assets/images/pix.png';
  import { format } from 'date-fns';
  import { useToastStore } from '@/stores/useToastStore';
  import { formatCreditCard } from '@/utils/masks';
  import { formatMoney } from '@/utils/formatters';

  const { t } = useI18n<GlobalLocaleSchema>();

  const data = computed(() => [
    {
      id: 1,
      date: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
      origin: 'Devolução',
      value: '300,00',
      devolutionForm: t('messages.creditCard'),
    },
    {
      id: 2,
      date: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
      origin: 'Compra',
      value: '300,00',
      devolutionForm: 'Pix',
    },
    {
      id: 3,
      date: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
      origin: 'Compra',
      value: '300,00',
      devolutionForm: t('devolution'),
    },
  ]);
  const pixCode = ref(
    '00020126360014BR.GOV.BCB.PIX0114+555199700262652040000530398654076456.005802BR5908efsdsadf6007asdfsdf62130509fdasdfsaf6304B671',
  );
  const isModalOpen = ref(false);
  const option = ref<0 | 1>(0);
  const { toast } = useToastStore();
  const months = Array.from({ length: 12 }).map((item, index) =>
    (index + 1).toString().padStart(2, '0'),
  );

  function copyToClipboard() {
    navigator.clipboard.writeText(pixCode.value);

    toast({ message: 'Código pix copiado com sucesso!' });
  }
  const period = ref('');
</script>

<template>
  <VRow>
    <VCol>
      <VCard>
        <VCardItem class="py-4">
          <VRow>
            <VCol cols="12" md>
              <AppDateTimePicker
                v-model="period"
                density="comfortable"
                class="pt-1"
                :label="t('period')"
                :config="{ mode: 'range' }"
              />
            </VCol>
            <VCol cols="12" md>
              <VSelect
                density="comfortable"
                class="py-1"
                :items="['Utilizado', 'Ativo']"
                :menu-props="{ maxHeight: '400' }"
                :label="t('status')"
                persistent-hint
              />
            </VCol>

            <VCol cols="12" md class="d-flex justify-end align-center">
              <VBtn
                @click="isModalOpen = true"
                height="48px"
                :items="['Utilizado', 'Ativo']"
                :menu-props="{ maxHeight: '400' }"
                label="Status"
              >
                {{ t('messages.addCredit') }}
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <TableExpandableRoot :loading="false" height="40vh">
        <template #header>
          <th>{{ t('actions') }}</th>
          <th>{{ t('date') }}</th>
          <th>{{ t('origin') }}</th>
          <th>{{ t('value') }}</th>
          <th>{{ t('form') }}</th>
        </template>

        <tr v-for="item in data" :key="item.id" class="py-4">
          <TableExpandableItem>
            <VBtn :title="t('details')" size="28">
              <VIcon icon="tabler-info-circle-filled" size="22" />
            </VBtn>
          </TableExpandableItem>
          <TableExpandableItem>{{ item.date }}</TableExpandableItem>
          <TableExpandableItem>{{ item.origin }}</TableExpandableItem>
          <TableExpandableItem>{{ item.value }}</TableExpandableItem>
          <TableExpandableItem>{{ item.devolutionForm }}</TableExpandableItem>
        </tr>
      </TableExpandableRoot>
    </VCol>

    <VCol cols="12">
      <VCard :title="t('total')">
        <VCardText>
          <ul>
            <li class="text-warning">
              {{ t('messages.usedCredit') }}: {{ formatMoney(14000) }}
            </li>
            <li class="text-success">
              {{ t('messages.activeCredit') }}: {{ formatMoney(14500) }}
            </li>
            <li class="text-primary">
              {{ t('total') }}: {{ formatMoney(14500 + 14000) }}
            </li>
          </ul>
        </VCardText>
      </VCard>
    </VCol>

    <DialogRoot :is-open="isModalOpen" @on-change="isModalOpen = $event">
      <DialogClose @on-close="isModalOpen = false" />

      <DialogContent class="d-flex flex-column" title="Pagamento">
        <VRow class="d-flex align-center">
          <VCol cols="auto">
            <VCard class="px-2 py-2 d-flex gap-3">
              <VTabs class="v-tabs-pill" v-model="option">
                <VTab>
                  <VIcon icon="tabler-credit-card" size="22" />
                  {{ t('messages.creditCard') }}
                </VTab>
                <VTab>
                  <VImg :src="pix" width="24" />
                  Pix
                </VTab>
              </VTabs>
            </VCard>
          </VCol>
          <VCol cols="2">
            <TextFieldRoot :loading="false">
              <TextFieldInput
                label-on-top
                :label="t('value')"
                default-value="300,00"
              />
            </TextFieldRoot>
          </VCol>
        </VRow>

        <VWindow v-model="option">
          <VWindowItem>
            <VForm @submit.prevent="console.log('test')" class="my-4">
              <VRow>
                <VCol cols="12" md>
                  <TextFieldRoot :loading="false">
                    <TextFieldInput
                      label-on-top
                      :label="t('messages.cardNumber')"
                      :masks="[formatCreditCard]"
                      :max-length="19"
                    />
                  </TextFieldRoot>
                </VCol>

                <VCol>
                  <TextFieldRoot :loading="false">
                    <TextFieldInput
                      label-on-top
                      :label="t('messages.printedNameOnCard')"
                    />
                  </TextFieldRoot>
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12" md>
                  <VSelect
                    class="elevate"
                    density="comfortable"
                    :label="t('month')"
                    persistent-hint
                    :items="months"
                  />
                </VCol>
                <VCol cols="12" md>
                  <VSelect
                    class="elevate"
                    :label="t('year')"
                    density="comfortable"
                    :items="['23', '24', '25', '26', '27', '28', '29', '30']"
                  />
                </VCol>
                <VCol cols="12" md>
                  <TextFieldInput label-on-top label="CVV" :max-length="3" />
                </VCol>
              </VRow>
              <VBtn class="mt-5">{{ t('messages.finishPayment') }}</VBtn>
            </VForm>
          </VWindowItem>
          <VWindowItem>
            <VCard
              style="overflow: visible"
              class="mt-3 pb-4 d-flex flex-column justify-center align-center"
            >
              <div
                class="px-4 py-4 text-white"
                style="
                  border-radius: 0.5rem;
                  background-color: rgb(var(--v-theme-on-background));
                "
              >
                <VRow>
                  <VCol>
                    <VImg
                      max-width="200"
                      width="200"
                      class="mx-auto"
                      :src="qrCode"
                    />
                  </VCol>
                </VRow>
                <VRow>
                  <VCol cols="auto" class="mx-auto">
                    <VBtn @click="copyToClipboard" class="mt-4"
                      >{{ t('messages.copyQRCode') }}
                    </VBtn>
                  </VCol>
                </VRow>
              </div>
            </VCard>
          </VWindowItem>
        </VWindow>
      </DialogContent>
    </DialogRoot>
  </VRow>
</template>
