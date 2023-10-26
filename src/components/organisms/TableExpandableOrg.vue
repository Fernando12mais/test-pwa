<script setup lang="ts" generic="T extends string">
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import { TableExpandableOrgProps } from './tableExpandableOrgTypes';

  const props = defineProps<TableExpandableOrgProps<T>>();
  const { t } = useI18n<GlobalLocaleSchema>();

  const emits = defineEmits({ onAction: (action: T) => true });

  function triggerAction(action: T) {
    emits('onAction', action);
  }

  const expandableData = computed(() =>
    !props.body.data ? [] : props.body.data,
  );

  const nonExpandableData = computed(() =>
    props.body.expandable ? [] : props.body.data,
  );
</script>

<template>
  <TableExpandableRoot :loading="loading" :headers-length="headersLength">
    <template #header>
      <th
        v-for="header in headers"
        :key="header.label"
        :class="`${header.short ? 'short' : ''} ${header.class}`"
      >
        {{ header.label }}
      </th>
      <th
        v-for="action in headerActions"
        :key="action.label"
        :class="{ short: action.short }"
      >
        <PopoverRoot location="bottom">
          <template #trigger>
            <VBtn @click.stop="triggerAction(action.action)" size="x-small">
              <VIcon size="1.2rem" :icon="action.icon" />
            </VBtn>
          </template>
          <PopoverBody> {{ t('messages.sendedOrders') }}</PopoverBody>
        </PopoverRoot>
      </th>
    </template>

    <tr v-for="item in nonExpandableData" :key="item.cols[0].label">
      <TableExpandableItem
        v-for="col in item.cols"
        :key="col.label"
        :class="col.class"
      >
        {{ col.label }}
      </TableExpandableItem>

      <TableExpandableItem v-for="action in bodyActions" :key="action.label">
        <VBtn color="success" size="small">{{ t('send') }}</VBtn>
      </TableExpandableItem>
    </tr>

    <TableExpandableList
      v-for="item in expandableData"
      :key="item.cols[0].label"
    >
      <TableExpandableItem
        v-for="col in item.cols"
        :key="col.label"
        :class="col.class"
      >
        {{ col.label }}
      </TableExpandableItem>

      <TableExpandableItem v-for="action in bodyActions" :key="action.label">
        <VBtn
          @click.stop="triggerAction(action.action)"
          color="success"
          size="small"
          >{{ t('send') }}</VBtn
        >
      </TableExpandableItem>

      <template #expandable-content>
        <TableExpandableOrg v-if="body.expandable" v-bind="body.expandable" />
      </template>
    </TableExpandableList>
  </TableExpandableRoot>
</template>

<!-- 
      </th>
      <th class="text-center">{{ t('date') }}</th>
      <th class="short">{{ t('messages.qtdItem') }}</th>
      <th class="short text-center">{{ t('messages.qtdUnit') }}</th>
      <th class="short text-center">{{ t('total') }}</th>

      <th style="width: 1%">
        <PopoverRoot location="bottom">
          <template #trigger>
            <Component :is="popoverTrigger"></Component>
            <VBtn
              @click="
                modal = true;
                getFinishedOrders();
              "
              size="x-small"
            >
              <VIcon size="1.2rem" icon="tabler-file-check" />
            </VBtn>
          </template>
          <PopoverBody> {{ t('messages.sendedOrders') }}</PopoverBody>
        </PopoverRoot>
      </th>
    </template>
    <TableExpandableList v-if="openOrder">
      <TableExpandableItem>{{ openOrder.id }}</TableExpandableItem>
      <TableExpandableItem>{{
        format(openOrder.createdAt, 'dd/MM/yyyy HH:mm:ss')
      }}</TableExpandableItem>
      <TableExpandableItem
        :class="{
          'highlight-text': isNewOrderCreated,
        }"
        >{{ newOrder?.quantity || openOrder.quantity }}</TableExpandableItem
      >
      <TableExpandableItem
        :class="{
          'highlight-text': isNewOrderCreated,
        }"
        >{{
          newOrder?.totalQuantity || openOrder.totalQuantity
        }}</TableExpandableItem
      >
      <TableExpandableItem
        class="text-end"
        :class="{
          'highlight-text': isNewOrderCreated,
        }"
        >{{
          formatMoney(Number(newOrder?.total || openOrder.total))
        }}</TableExpandableItem
      >
      <TableExpandableItem>
        <VBtn color="success" size="small">{{ t('send') }}</VBtn>
      </TableExpandableItem>

      <template #expandable-content>
        <TableExpandableRoot :loading="false">
          <template #header>
            <th></th>
            <th>Cód</th>
            <th>Tipo</th>
            <th>Item</th>
            <th>Obs</th>
            <th>Medida</th>
            <th>Marca</th>
            <th>QTD</th>
            <th>V.Unit</th>
            <th>V.total</th>
          </template>
          <tr
            v-for="(item, i) in newOrder?.itens || openOrder.itens"
            :key="item.id"
          >
            <TableExpandableItem
              @click="
                if (
                  newOrder?.itens.some(order => order.id == item.id) &&
                  newOrder?.itens?.length
                ) {
                  newOrder = {
                    ...newOrder,
                    itens: newOrder.itens.filter((item, index) => index !== i),
                  };
                }
                if (
                  !newOrder?.itens.some(order => order.id == item.id) &&
                  openOrder?.itens?.length
                ) {
                  openOrder = {
                    ...openOrder,
                    itens: openOrder.itens.filter((item, index) => index !== i),
                  };
                }
              "
            >
              <button>
                <VIcon icon="tabler-trash-x" color="error" />
              </button>
            </TableExpandableItem>
            <TableExpandableItem>{{ item.id }}</TableExpandableItem>
            <TableExpandableItem>{{ item.type }}</TableExpandableItem>
            <TableExpandableItem>{{ item.itemId }}</TableExpandableItem>
            <TableExpandableItem>{{ item.obs }}</TableExpandableItem>
            <TableExpandableItem>{{ item.size }}</TableExpandableItem>
            <TableExpandableItem>{{ item.brand }}</TableExpandableItem>
            <TableExpandableItem>{{
              Number(item.quantity)
            }}</TableExpandableItem>

            <TableExpandableItem class="text-end">{{
              formatMoney(Number(item.price))
            }}</TableExpandableItem>
            <TableExpandableItem class="text-end">{{
              formatMoney(Number(item.total))
            }}</TableExpandableItem> -->
<!-- </tr> -->
<!-- </TableExpandableRoot> -->
<!-- </template> -->
<!-- </TableExpandableList> -->

<style scoped>
  .short {
    width: 1%;
    white-space: nowrap;
  }
</style>
