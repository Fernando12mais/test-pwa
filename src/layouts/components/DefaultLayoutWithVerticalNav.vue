<script lang="ts" setup>
  import navItems from '@/navigation/vertical';
  import { useThemeConfig } from '@core/composable/useThemeConfig';
  import { formatMoney } from '@/utils/formatters';

  // Components
  // import Footer from '@/layouts/components/Footer.vue';
  // import NavBarI18n from '@/layouts/components/NavBarI18n.vue';
  // import NavBarNotifications from '@/layouts/components/NavBarNotifications.vue';
  // import NavbarShortcuts from '@/layouts/components/NavbarShortcuts.vue';
  // import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue';
  // import NavSearchBar from '@/layouts/components/NavSearchBar.vue';
  import UserProfile from '@/layouts/components/UserProfile.vue';

  // @layouts plugin
  import { VerticalNavLayout } from '@layouts';
  import { useProductsStore } from '@stores/useProductsStore';

  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import { useFinishOrder } from '@composables/useFinishOrder';
  import { useUserConfigStore } from '@stores/useUserConfigStore';
  import { useUserStore } from '@stores/useUserStore';

  const { appRouteTransition, isLessThanOverlayNavBreakpoint } =
    useThemeConfig();
  const { width: windowWidth } = useWindowSize();

  const isCartOpen = ref(false);
  const ProductStore = useProductsStore();
  const userConfigStore = useUserConfigStore();

  const userStore = useUserStore();
  const { getCreditLimit } = userStore;
  const { creditLimit, isFetchingCreditLimit } = storeToRefs(userStore);

  const {
    sendOrderFormData,
    finishOrderSchema,
    getFieldValues,

    updateField,
    finishOrder,
    orderFinishError,
  } = useFinishOrder();
  const { t } = useI18n<GlobalLocaleSchema>();

  const { order } = storeToRefs(ProductStore);

  const isSendModalOpen = ref(false);

  const onSubmit = async () => {
    await finishOrder();
    isSendModalOpen.value = false;
    isCartOpen.value = false;
  };
  const handleSendBtn = () => {
    isSendModalOpen.value = true;
    getFieldValues();
  };
  const closeModal = () => {
    isSendModalOpen.value = false;
  };

  onBeforeMount(() => {
    getCreditLimit();
  });
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->

    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <VBtn
          v-if="isLessThanOverlayNavBreakpoint(windowWidth)"
          icon
          variant="text"
          color="default"
          class="ms-n3"
          size="small"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="tabler-menu-2" size="24" />
        </VBtn>
        <VImg
          :src="userConfigStore?.config?.images?.logo"
          max-height="2rem"
          class="mr-2"
        />

        <VSpacer />
        <SkeletonRoot v-if="isFetchingCreditLimit" height="48" width="100" />
        <InfoCardRoot
          class="mr-1"
          v-else
          :label="t('credit')"
          :value="formatMoney(creditLimit?.limitAvailable || 0)"
          style="
            border: 2px solid rgb(var(--v-theme-success));
            color: rgb(var(--v-theme-success));
          "
        />

        <!-- <NavSearchBar class="ms-lg-n3" /> -->

        <!-- <NavBarI18n />
        <NavbarThemeSwitcher /> -->
        <!-- <NavbarShortcuts /> -->
        <!-- <NavBarNotifications class="me-2" /> -->
        <div>
          <VIcon
            @click="isCartOpen = !isCartOpen"
            icon="tabler-shopping-cart"
          />
        </div>
        <UserProfile class="ms-1" />
      </div>
    </template>

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component }">
      <Transition :name="appRouteTransition" mode="out-in">
        <Component :is="Component" />
      </Transition>
    </RouterView>

    <!-- 👉 Footer -->
    <!-- <template #footer>
      <Footer />
    </template> -->

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
    <DrawerRoot
      @on-change="isCartOpen = !isCartOpen"
      :open="isCartOpen"
      style="width: 90%"
      class="drawer-flex"
    >
      <VRow class="flex-grow-0">
        <VCol>
          <h1 class="text-center">{{ t('orders') }}</h1>
        </VCol>
      </VRow>

      <VRow class="px-1 py-2 mt-0" style="overflow: scroll">
        <VCol
          v-for="(product, index) in order?.itens"
          :key="product.id"
          cols="12"
        >
          <CartProduct
            :class="{
              'text-error': orderFinishError?.itemIds?.includes(product.itemId),
            }"
            v-bind="product"
            :index="index"
          />
        </VCol>
      </VRow>

      <VRow class="mt-auto">
        <VCol cols="12">
          <p class="text-error text-center ma-0" style="min-height: 16px">
            {{ orderFinishError?.message ? t(orderFinishError?.message) : '' }}
          </p>
        </VCol>
        <VCol>
          <VCard
            v-if="order"
            class="text-center text-surface"
            style="background-color: rgba(var(--v-theme-on-surface))"
          >
            <VRow class="pa-2">
              <VCol class="d-flex flex-column">
                <span>QTD </span>
                <span>{{ Number(order?.totalQuantity) }}</span>
              </VCol>

              <VCol class="d-flex flex-column">
                <span>{{ t('total') }} </span>
                <span>{{ formatMoney(order?.total || 0) }}</span>
              </VCol>

              <VCol cols="5">
                <PopoverRoot
                  style="height: 100%"
                  location="right"
                  :open-on-focus="false"
                  :open-on-hover="false"
                  open-on-click
                >
                  <template #trigger>
                    <VBtn
                      height="100%"
                      block
                      class="btn-wrap"
                      color="success"
                      @click="handleSendBtn"
                      >{{ t('send') }}</VBtn
                    >
                  </template>
                </PopoverRoot>
              </VCol>
            </VRow>
          </VCard>
        </VCol>
      </VRow>

      <DialogRoot :is-open="isSendModalOpen">
        <DialogClose @click="closeModal" />

        <DialogContent title="Finalizar pagamento">
          <FormGenerator
            :height="400"
            class="mt-4"
            v-bind="sendOrderFormData"
            :actions="sendOrderFormData.actions"
            :fields="sendOrderFormData.fields"
            :schema="finishOrderSchema"
            @on-submit="onSubmit"
            @on-field-update="updateField($event.id, $event.value)"
            @on-action="
              if ($event.action == 'goBack') {
                closeModal();
              }
            "
          />
        </DialogContent>
      </DialogRoot>
    </DrawerRoot>
  </VerticalNavLayout>
</template>
